package com.dochub.dto;

import java.time.LocalDateTime;

import com.dochub.model.Document;

public class UploadDocumentResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Integer ownerId;
    private Boolean isPublic;
    private String topic;
    private String hashtags;
    private String s3Key;
    private LocalDateTime createdAt;

    public static UploadDocumentResponse fromDocument(Document document) {
        UploadDocumentResponse response = new UploadDocumentResponse();
        response.setId(document.getId());
        response.setFileName(document.getFileName());
        response.setFileType(document.getFileType());
        response.setFileSize(document.getFileSize());
        response.setOwnerId(document.getOwnerId());
        response.setIsPublic(document.getIsPublic());
        response.setTopic(document.getTopic());
        response.setHashtags(document.getHashtags());
        response.setS3Key(document.getS3Key());
        response.setCreatedAt(document.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
        this.ownerId = ownerId;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getHashtags() {
        return hashtags;
    }

    public void setHashtags(String hashtags) {
        this.hashtags = hashtags;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
