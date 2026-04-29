package com.dochub.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dochub.model.Document;
import com.dochub.model.DocumentShare;
import com.dochub.model.User;
import com.dochub.repository.DocumentRepository;
import com.dochub.repository.DocumentShareRepository;
import com.dochub.repository.UserRepository;
import com.dochub.security.SecurityUtils;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentShareRepository documentShareRepository;
    private final S3Service s3Service;
    private final UserRepository userRepository;

    @Value("${backend.public-base-url:}")
    private String backendPublicBaseUrl;

    @Value("${documents.share.link-expiration-minutes:60}")
    private int shareLinkExpirationMinutes;

    public DocumentService(
            DocumentRepository documentRepository,
            DocumentShareRepository documentShareRepository,
            S3Service s3Service,
            UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.documentShareRepository = documentShareRepository;
        this.s3Service = s3Service;
        this.userRepository = userRepository;
    }

    public Document uploadDocument(
            MultipartFile file,
            boolean isPublic,
            String topic,
            String hashtags,
            Long providedOwnerId) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload is required");
        }
        
        Long ownerId = SecurityUtils.getCurrentUserId();
        if (ownerId == null) {
            throw new IllegalArgumentException("User must be logged in");
        }

        String key = s3Service.uploadFile(file);

        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setS3Key(key);
        document.setFilePath(key);
        document.setFileType(resolveFileType(file.getOriginalFilename(), file.getContentType()));
        document.setFileSize(file.getSize());
        document.setOwnerId(ownerId);
        document.setIsPublic(isPublic);
        document.setTopic(topic);
        document.setHashtags(hashtags);
        document.setStatus(Document.STATUS_ACTIVE);
        document.setDeletedAt(null);
        document.setOriginalPath(key);
        document.setShareEnabled(false);
        document.setShareToken(null);
        document.setShareExpiresAt(null);

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findByStatus(Document.STATUS_ACTIVE)
                .stream()
                .filter(this::isDocumentContentAvailable)
                .toList();
    }

    public List<Document> getTrashDocumentsByOwner(Long providedOwnerId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new IllegalArgumentException("User must be logged in");
        }
        
        User currentUser = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean isAdmin = "admin".equalsIgnoreCase(currentUser.getRole());
        Long ownerId = (providedOwnerId != null && isAdmin) ? providedOwnerId : currentUserId;

        return documentRepository.findByOwnerIdAndStatus(ownerId, Document.STATUS_TRASH)
                .stream()
                .filter(this::isDocumentContentAvailable)
                .sorted(Comparator.comparing(Document::getDeletedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public List<Document> getSharedDocuments(Long dummyId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be logged in");
        }

        List<DocumentShare> shares = documentShareRepository.findBySharedWithUserIdAndHiddenForRecipientFalse(userId);
        if (shares.isEmpty()) {
            return List.of();
        }

        Set<Long> documentIds = shares.stream()
                .filter(this::isShareGrantActive)
                .map(DocumentShare::getDocumentId)
                .collect(Collectors.toSet());
        if (documentIds.isEmpty()) {
            return List.of();
        }
        return documentRepository.findAllById(documentIds)
                .stream()
                .filter(doc -> Document.STATUS_ACTIVE == safeStatus(doc))
                .filter(this::isDocumentContentAvailable)
                .sorted(Comparator.comparing(Document::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    public Document getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        if (Document.STATUS_TRASH == safeStatus(document)) {
            throw new IllegalArgumentException("Bai viet goc da bi xoa, vui long doi khoi phuc");
        }
        return document;
    }

    public Document getDocumentByIdIncludingTrash(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    @Transactional
    public Document softDeleteDocument(Long documentId, Long ownerId) {
        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_TRASH == safeStatus(document)) {
            return document;
        }

        document.setStatus(Document.STATUS_TRASH);
        document.setDeletedAt(LocalDateTime.now());
        document.setIsPublic(false);
        document.setShareEnabled(false);
        document.setShareToken(null);
        document.setShareExpiresAt(null);
        return documentRepository.save(document);
    }

    @Transactional
    public Document restoreDocument(Long documentId, Long ownerId) {
        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_ACTIVE == safeStatus(document)) {
            return document;
        }

        document.setStatus(Document.STATUS_ACTIVE);
        document.setDeletedAt(null);
        document.setShareEnabled(false);
        document.setShareToken(null);
        document.setShareExpiresAt(null);
        return documentRepository.save(document);
    }

    @Transactional
    public Document updateVisibility(Long documentId, Long ownerId, boolean isPublic) {
        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_TRASH == safeStatus(document)) {
            throw new IllegalArgumentException("Cannot update permission for document in trash");
        }

        boolean wasPublic = Boolean.TRUE.equals(document.getIsPublic());
        document.setIsPublic(isPublic);

        if (wasPublic && !isPublic) {
            // Moving to private mode must immediately invalidate all active link access.
            document.setShareEnabled(false);
            document.setShareToken(null);
            document.setShareExpiresAt(null);

            List<DocumentShare> shares = documentShareRepository.findByDocumentId(documentId);
            for (DocumentShare share : shares) {
                if (Boolean.TRUE.equals(share.getSharedViaLink())) {
                    share.setHiddenForRecipient(true);
                    share.setAccessExpiresAt(null);
                    documentShareRepository.save(share);
                }
            }
        }

        return documentRepository.save(document);
    }

    @Transactional
    public String createShareLink(Long documentId, Long ownerId) {
        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_TRASH == safeStatus(document)) {
            throw new IllegalArgumentException("Cannot create share link for document in trash");
        }

        String token = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        document.setShareToken(token);
        document.setShareEnabled(true);
        document.setShareExpiresAt(LocalDateTime.now().plusMinutes(Math.max(1, shareLinkExpirationMinutes)));
        documentRepository.save(document);

        return normalizeBaseUrl(backendPublicBaseUrl) + "/api/documents/shared/" + token + "/open";
    }

    @Transactional
    public void revokeShareLink(Long documentId, Long ownerId) {
        Document document = getOwnedDocument(documentId, ownerId);
        document.setShareEnabled(false);
        document.setShareToken(null);
        document.setShareExpiresAt(null);
        documentRepository.save(document);
    }

    @Transactional
    public void permanentlyDeleteDocument(Long documentId, Long ownerId) {
        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_TRASH != safeStatus(document)) {
            throw new IllegalArgumentException("Document must be in trash before permanent deletion");
        }
        deleteCloudAndMetadata(document);
    }

    @Transactional
    public void removeDocumentFromSharedView(Long documentId, Long dummyId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new IllegalArgumentException("User must be logged in");
        }

        DocumentShare share = documentShareRepository.findByDocumentIdAndSharedWithUserId(documentId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Shared document not found for this user"));
        share.setHiddenForRecipient(true);
        documentShareRepository.save(share);
    }

    @Transactional
    public Document shareDocumentWithUser(Long documentId, Long ownerId, Long sharedWithUserId) {
        if (sharedWithUserId == null) {
            throw new IllegalArgumentException("sharedWithUserId is required");
        }
        if (ownerId != null && ownerId.equals(sharedWithUserId)) {
            throw new IllegalArgumentException("Owner cannot share document with self");
        }

        Document document = getOwnedDocument(documentId, ownerId);
        if (Document.STATUS_TRASH == safeStatus(document)) {
            throw new IllegalArgumentException("Cannot share document in trash");
        }

        DocumentShare share = documentShareRepository
                .findByDocumentIdAndSharedWithUserId(documentId, sharedWithUserId)
                .orElseGet(DocumentShare::new);

        share.setDocumentId(documentId);
        share.setOwnerId(ownerId);
        share.setSharedWithUserId(sharedWithUserId);
        share.setHiddenForRecipient(false);
        share.setSharedViaLink(false);
        share.setAccessExpiresAt(null);
        documentShareRepository.save(share);

        return document;
    }

    @Transactional
    public int purgeTrashDocumentsOlderThanDays(int retentionDays) {
        if (retentionDays <= 0) {
            throw new IllegalArgumentException("retentionDays must be positive");
        }

        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        List<Document> expiredDocuments = documentRepository
                .findByStatusAndDeletedAtBefore(Document.STATUS_TRASH, cutoff);

        if (expiredDocuments.isEmpty()) {
            return 0;
        }

        int deletedCount = 0;
        for (Document document : expiredDocuments) {
            try {
                deleteCloudAndMetadata(document);
                deletedCount += 1;
            } catch (RuntimeException ex) {
                // Best-effort cleanup: failed documents will be retried on the next run.
            }
        }

        return deletedCount;
    }

    public String getPreviewUrl(Long documentId) {
        return getPreviewUrl(documentId, null);
    }

    public String getPreviewUrl(Long documentId, Long dummyId) {
        Long userId = SecurityUtils.getCurrentUserId();
        Document document = getDocumentById(documentId);
        ensureUserCanAccessDocument(document, userId, null);
        if (s3Service.isS3StorageActive()) {
            return s3Service.createPresignedPreviewUrl(document.getS3Key(), document.getFileName());
        }

        if (!isDocumentContentAvailable(document)) {
            throw new IllegalArgumentException("Document content not found. Please upload the file again.");
        }

        return normalizeBaseUrl(backendPublicBaseUrl) + "/api/documents/" + documentId + "/content";
    }

    public String getPreviewUrlByShareToken(String shareToken, Long dummyId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (shareToken == null || shareToken.isBlank()) {
            throw new IllegalArgumentException("Share token is required");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Login is required to access shared document");
        }

        Document document = documentRepository
                .findByShareTokenAndStatus(shareToken, Document.STATUS_ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("Shared document not found or link is invalid"));

        ensureUserCanAccessDocument(document, userId, shareToken);
        ensureRecipientHasSharedRecord(document, userId);

        if (s3Service.isS3StorageActive()) {
            return s3Service.createPresignedPreviewUrl(document.getS3Key(), document.getFileName());
        }

        if (!isDocumentContentAvailable(document)) {
            throw new IllegalArgumentException("Document content not found. Please upload the file again.");
        }

        return normalizeBaseUrl(backendPublicBaseUrl)
            + "/api/documents/"
            + document.getId()
            + "/content?shareToken="
            + shareToken;
    }

    public Resource loadLocalDocumentResource(Long documentId) {
        return loadLocalDocumentResource(documentId, null, null);
    }

    public Resource loadLocalDocumentResource(Long documentId, Long dummyId, String shareToken) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (s3Service.isS3StorageActive()) {
            throw new IllegalStateException("Local resource endpoint is not available while S3 mode is enabled");
        }

        Document document = getDocumentById(documentId);
        ensureUserCanAccessDocument(document, userId, shareToken);
        Path localPath = s3Service.resolveLocalPath(document.getFilePath());
        try {
            if (!Files.exists(localPath)) {
                throw new IllegalArgumentException("Document content not found");
            }
            return new UrlResource(localPath.toUri());
        } catch (MalformedURLException ex) {
            throw new IllegalArgumentException("Document path is invalid", ex);
        }
    }

    public String resolveContentType(Long documentId) {
        Document document = getDocumentById(documentId);
        Path localPath = s3Service.resolveLocalPath(document.getFilePath());
        try {
            String contentType = Files.probeContentType(localPath);
            if (contentType != null && !contentType.isBlank()) {
                return contentType;
            }
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }

        return switch ((document.getFileType() == null ? "" : document.getFileType()).toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "gif" -> "image/gif";
            case "txt" -> "text/plain";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "ppt" -> "application/vnd.ms-powerpoint";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            default -> "application/octet-stream";
        };
    }

    private String normalizeBaseUrl(String baseUrl) {
        if (baseUrl == null || baseUrl.isBlank()) {
            return "";
        }
        return baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    private boolean isDocumentContentAvailable(Document document) {
        if (document == null) {
            return false;
        }

        if (s3Service.isS3StorageActive()) {
            return true;
        }

        try {
            Path localPath = s3Service.resolveLocalPath(document.getFilePath());
            return Files.exists(localPath);
        } catch (Exception ex) {
            return false;
        }
    }

    private String resolveFileType(String fileName, String contentType) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        }
        if (contentType != null && contentType.contains("/")) {
            return contentType.substring(contentType.indexOf('/') + 1).toLowerCase();
        }
        return "unknown";
    }

    private Document getOwnedDocument(Long documentId, Long providedOwnerId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new IllegalArgumentException("User must be logged in");
        }

        User currentUser = userRepository.findById(currentUserId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        boolean isAdmin = "admin".equalsIgnoreCase(currentUser.getRole());
        Long targetOwnerId = (providedOwnerId != null && isAdmin) ? providedOwnerId : currentUserId;

        Document document = getDocumentByIdIncludingTrash(documentId);
        if (document.getOwnerId() == null || (!targetOwnerId.equals(document.getOwnerId()) && !isAdmin)) {
            throw new IllegalArgumentException("Only owner or admin can modify this document");
        }
        return document;
    }

    private void deleteCloudAndMetadata(Document document) {
        s3Service.deleteFile(document.getS3Key(), document.getFilePath());
        documentShareRepository.deleteByDocumentId(document.getId());
        documentRepository.delete(document);
    }

    private void ensureUserCanAccessDocument(Document document, Long userId, String shareToken) {
        if (document == null) {
            throw new IllegalArgumentException("Document not found");
        }
        if (Document.STATUS_TRASH == safeStatus(document)) {
            throw new IllegalArgumentException("Bai viet goc da bi xoa, vui long doi khoi phuc");
        }
        if (Boolean.TRUE.equals(document.getIsPublic())) {
            return;
        }
        if (Boolean.TRUE.equals(document.getShareEnabled())
                && document.getShareToken() != null
                && document.getShareToken().equals(shareToken)
                && isShareTokenActive(document)) {
            return;
        }
        if (userId != null) {
            if (userId.equals(document.getOwnerId())) {
                return;
            }
            DocumentShare share = documentShareRepository
                    .findByDocumentIdAndSharedWithUserId(document.getId(), userId)
                    .orElse(null);
            if (isShareGrantActive(share)) {
                return;
            }
        }

        throw new IllegalArgumentException("You do not have permission to access this document");
    }

    private void ensureRecipientHasSharedRecord(Document document, Long userId) {
        if (document == null || userId == null) {
            return;
        }
        if (document.getOwnerId() != null && document.getOwnerId().equals(userId)) {
            return;
        }

        DocumentShare share = documentShareRepository
                .findByDocumentIdAndSharedWithUserId(document.getId(), userId)
                .orElseGet(DocumentShare::new);

        share.setDocumentId(document.getId());
        share.setOwnerId(document.getOwnerId());
        share.setSharedWithUserId(userId);
        share.setHiddenForRecipient(false);
        share.setSharedViaLink(true);
        share.setAccessExpiresAt(document.getShareExpiresAt());
        documentShareRepository.save(share);
    }

    private boolean isShareTokenActive(Document document) {
        if (!Boolean.TRUE.equals(document.getShareEnabled())) {
            return false;
        }
        LocalDateTime expiresAt = document.getShareExpiresAt();
        if (expiresAt == null) {
            return false;
        }
        return LocalDateTime.now().isBefore(expiresAt);
    }

    private boolean isShareGrantActive(DocumentShare share) {
        if (share == null || Boolean.TRUE.equals(share.getHiddenForRecipient())) {
            return false;
        }
        if (!Boolean.TRUE.equals(share.getSharedViaLink())) {
            return true;
        }

        LocalDateTime expiresAt = share.getAccessExpiresAt();
        return expiresAt != null && LocalDateTime.now().isBefore(expiresAt);
    }

    private int safeStatus(Document document) {
        return document.getStatus() == null ? Document.STATUS_ACTIVE : document.getStatus();
    }
}
