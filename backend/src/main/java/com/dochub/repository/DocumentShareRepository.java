package com.dochub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dochub.model.DocumentShare;

public interface DocumentShareRepository extends JpaRepository<DocumentShare, Long> {

    List<DocumentShare> findBySharedWithUserIdAndHiddenForRecipientFalse(Long sharedWithUserId);

    List<DocumentShare> findByDocumentId(Long documentId);

    Optional<DocumentShare> findByDocumentIdAndSharedWithUserId(Long documentId, Long sharedWithUserId);

    boolean existsByDocumentIdAndSharedWithUserIdAndHiddenForRecipientFalse(Long documentId, Long sharedWithUserId);

    void deleteByDocumentId(Long documentId);
}
