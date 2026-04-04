package com.dochub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dochub.model.DocumentShare;

public interface DocumentShareRepository extends JpaRepository<DocumentShare, Long> {

    List<DocumentShare> findBySharedWithUserIdAndHiddenForRecipientFalse(Integer sharedWithUserId);

    Optional<DocumentShare> findByDocumentIdAndSharedWithUserId(Long documentId, Integer sharedWithUserId);

    void deleteByDocumentId(Long documentId);
}
