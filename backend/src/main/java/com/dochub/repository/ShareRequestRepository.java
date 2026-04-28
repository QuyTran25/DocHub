package com.dochub.repository;

import com.dochub.model.ShareRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShareRequestRepository extends JpaRepository<ShareRequest, Long> {
    List<ShareRequest> findByOwnerIdAndStatus(Long ownerId, String status);
    Optional<ShareRequest> findByDocumentIdAndRequesterIdAndStatus(Long documentId, Long requesterId, String status);
}
