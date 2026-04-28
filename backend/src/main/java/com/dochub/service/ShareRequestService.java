package com.dochub.service;

import com.dochub.exception.ResourceNotFoundException;
import com.dochub.model.Document;
import com.dochub.model.ShareRequest;
import com.dochub.repository.DocumentRepository;
import com.dochub.repository.ShareRequestRepository;
import com.dochub.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShareRequestService {

    private final ShareRequestRepository shareRequestRepository;
    private final DocumentRepository documentRepository;
    private final DocumentService documentService;

    public ShareRequestService(ShareRequestRepository shareRequestRepository, DocumentRepository documentRepository, DocumentService documentService) {
        this.shareRequestRepository = shareRequestRepository;
        this.documentRepository = documentRepository;
        this.documentService = documentService;
    }

    @Transactional
    public ShareRequest createRequest(Long documentId) {
        Long requesterId = SecurityUtils.getCurrentUserId();
        if (requesterId == null) {
            throw new IllegalArgumentException("User must be logged in to create a share request");
        }

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if (document.getOwnerId().equals(requesterId)) {
            throw new IllegalArgumentException("You are already the owner of this document");
        }

        shareRequestRepository.findByDocumentIdAndRequesterIdAndStatus(documentId, requesterId, "PENDING")
                .ifPresent(req -> {
                    throw new IllegalArgumentException("Bạn đã gửi yêu cầu rồi, vui lòng chờ duyệt!");
                });

        ShareRequest request = new ShareRequest(documentId, requesterId, document.getOwnerId());
        return shareRequestRepository.save(request);
    }

    public List<ShareRequest> getPendingRequests() {
        Long ownerId = SecurityUtils.getCurrentUserId();
        if (ownerId == null) {
            throw new IllegalArgumentException("User must be logged in to view pending requests");
        }
        return shareRequestRepository.findByOwnerIdAndStatus(ownerId, "PENDING");
    }

    @Transactional
    public ShareRequest approveRequest(Long requestId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ShareRequest request = shareRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Share request not found"));

        if (!request.getOwnerId().equals(currentUserId)) {
            throw new IllegalArgumentException("Bạn không có quyền duyệt yêu cầu này!");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("This request is not pending");
        }

        request.setStatus("APPROVED");
        shareRequestRepository.save(request);

        documentService.shareDocumentWithUser(request.getDocumentId(), currentUserId, request.getRequesterId());
        return request;
    }

    @Transactional
    public ShareRequest rejectRequest(Long requestId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        ShareRequest request = shareRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Share request not found"));

        if (!request.getOwnerId().equals(currentUserId)) {
            throw new IllegalArgumentException("Bạn không có quyền duyệt yêu cầu này!");
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new IllegalArgumentException("This request is not pending");
        }

        request.setStatus("REJECTED");
        return shareRequestRepository.save(request);
    }
}
