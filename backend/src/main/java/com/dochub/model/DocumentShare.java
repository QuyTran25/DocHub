package com.dochub.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "document_shares", uniqueConstraints = {
        @UniqueConstraint(name = "uk_document_shared_user", columnNames = { "document_id", "shared_with_user_id" })
})
public class DocumentShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "shared_with_user_id", nullable = false)
    private Long sharedWithUserId;

    @Column(name = "hidden_for_recipient", nullable = false)
    private Boolean hiddenForRecipient = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getSharedWithUserId() {
        return sharedWithUserId;
    }

    public void setSharedWithUserId(Long sharedWithUserId) {
        this.sharedWithUserId = sharedWithUserId;
    }

    public Boolean getHiddenForRecipient() {
        return hiddenForRecipient;
    }

    public void setHiddenForRecipient(Boolean hiddenForRecipient) {
        this.hiddenForRecipient = hiddenForRecipient;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
