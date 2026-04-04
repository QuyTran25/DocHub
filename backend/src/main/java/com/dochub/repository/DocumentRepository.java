package com.dochub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dochub.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
}
