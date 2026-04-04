package com.dochub.controller;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dochub.dto.PreviewUrlResponse;
import com.dochub.dto.UploadDocumentResponse;
import com.dochub.model.Document;
import com.dochub.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPublic", defaultValue = "false") boolean isPublic,
            @RequestParam(value = "topic", required = false) String topic,
            @RequestParam(value = "hashtags", required = false) String hashtags,
            @RequestParam(value = "ownerId", required = false) Integer ownerId) {

        try {
            Document savedDocument = documentService.uploadDocument(file, isPublic, topic, hashtags, ownerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(UploadDocumentResponse.fromDocument(savedDocument));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UploadDocumentResponse>> listDocuments() {
        List<UploadDocumentResponse> response = documentService.getAllDocuments()
                .stream()
                .map(UploadDocumentResponse::fromDocument)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{documentId}/preview-url")
    public ResponseEntity<?> getPreviewUrl(@PathVariable Long documentId) {
        try {
            String url = documentService.getPreviewUrl(documentId);
            return ResponseEntity.ok(new PreviewUrlResponse(url));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Cannot create preview URL: " + ex.getMessage());
        }
    }

    @GetMapping("/{documentId}/open")
    public ResponseEntity<?> openDocumentInNewTab(@PathVariable Long documentId) {
        try {
            String url = documentService.getPreviewUrl(documentId);
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Cannot open document: " + ex.getMessage());
        }
    }

    @GetMapping("/{documentId}/content")
    public ResponseEntity<?> streamDocumentContent(@PathVariable Long documentId) {
        try {
            Document document = documentService.getDocumentById(documentId);
            Resource resource = documentService.loadLocalDocumentResource(documentId);
            String contentType = documentService.resolveContentType(documentId);

            ContentDisposition disposition = ContentDisposition.inline()
                    .filename(document.getFileName(), StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                    .body(resource);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Cannot stream document content: " + ex.getMessage());
        }
    }
}
