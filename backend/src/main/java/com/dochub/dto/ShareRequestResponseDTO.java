package com.dochub.dto;

import java.time.LocalDateTime;

public class ShareRequestResponseDTO {

    private Long id;
    private Long documentId;
    private String documentName;
    private Long requesterId;
    private String requesterName;
    private String status;
    private LocalDateTime createdAt;

    public ShareRequestResponseDTO() {
    }

    public ShareRequestResponseDTO(Long id, Long documentId, String documentName, Long requesterId, 
                                   String requesterName, String status, LocalDateTime createdAt) {
        this.id = id;
        this.documentId = documentId;
        this.documentName = documentName;
        this.requesterId = requesterId;
        this.requesterName = requesterName;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
