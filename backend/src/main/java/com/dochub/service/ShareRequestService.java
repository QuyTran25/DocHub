package com.dochub.service;

import com.dochub.dto.ShareRequestResponseDTO;
import com.dochub.exception.ResourceNotFoundException;
import com.dochub.model.Document;
import com.dochub.model.ShareRequest;
import com.dochub.model.User;
import com.dochub.repository.DocumentRepository;
import com.dochub.repository.ShareRequestRepository;
import com.dochub.repository.UserRepository;
import com.dochub.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShareRequestService {

    private final ShareRequestRepository shareRequestRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final DocumentService documentService;

    public ShareRequestService(ShareRequestRepository shareRequestRepository, DocumentRepository documentRepository, 
                               UserRepository userRepository, DocumentService documentService) {
        this.shareRequestRepository = shareRequestRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
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

    public List<ShareRequestResponseDTO> getPendingRequests() {
        Long ownerId = SecurityUtils.getCurrentUserId();
        if (ownerId == null) {
            throw new IllegalArgumentException("User must be logged in to view pending requests");
        }
        return shareRequestRepository.findByOwnerIdAndStatus(ownerId, "PENDING")
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ShareRequestResponseDTO convertToDTO(ShareRequest request) {
        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found"));
        
        Document document = documentRepository.findById(request.getDocumentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        
        return new ShareRequestResponseDTO(
                request.getId(),
                request.getDocumentId(),
                document.getFileName(),
                request.getRequesterId(),
                requester.getFullName() != null ? requester.getFullName() : requester.getUsername(),
                request.getStatus(),
                request.getCreatedAt()
        );
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
