package com.dochub.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dochub.model.Document;
import com.dochub.repository.DocumentRepository;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final S3Service s3Service;

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
        return documentRepository.findAll();
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
