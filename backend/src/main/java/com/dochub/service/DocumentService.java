package com.dochub.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dochub.model.Document;
import com.dochub.repository.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final S3Service s3Service;

    @Value("${backend.public-base-url:http://localhost:8080}")
    private String backendPublicBaseUrl;

    public DocumentService(DocumentRepository documentRepository, S3Service s3Service) {
        this.documentRepository = documentRepository;
        this.s3Service = s3Service;
    }

    public Document uploadDocument(
            MultipartFile file,
            boolean isPublic,
            String topic,
            String hashtags,
            Integer ownerId) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload is required");
        }
        if (ownerId == null) {
            throw new IllegalArgumentException("ownerId is required");
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

        return documentRepository.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .filter(this::isDocumentContentAvailable)
                .toList();
    }

    public Document getDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
    }

    public String getPreviewUrl(Long documentId) {
        Document document = getDocumentById(documentId);
        if (s3Service.isS3StorageActive()) {
            return s3Service.createPresignedPreviewUrl(document.getS3Key(), document.getFileName());
        }

        if (!isDocumentContentAvailable(document)) {
            throw new IllegalArgumentException("Document content not found. Please upload the file again.");
        }

        return normalizeBaseUrl(backendPublicBaseUrl) + "/api/documents/" + documentId + "/content";
    }

    public Resource loadLocalDocumentResource(Long documentId) {
        if (s3Service.isS3StorageActive()) {
            throw new IllegalStateException("Local resource endpoint is not available while S3 mode is enabled");
        }

        Document document = getDocumentById(documentId);
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
            return "http://localhost:8080";
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
}
