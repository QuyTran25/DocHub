package com.dochub.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dochub.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

	List<Document> findByStatus(Integer status);

	List<Document> findByOwnerIdAndStatus(Long ownerId, Integer status);

	List<Document> findByStatusAndDeletedAtBefore(Integer status, LocalDateTime cutoffTime);

	Optional<Document> findByShareTokenAndStatus(String shareToken, Integer status);
}
