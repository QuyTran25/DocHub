package com.dochub.controller;

import com.dochub.model.ShareRequest;
import com.dochub.service.ShareRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/share-requests")
public class ShareRequestController {

    private final ShareRequestService shareRequestService;

    public ShareRequestController(ShareRequestService shareRequestService) {
        this.shareRequestService = shareRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createShareRequest(@RequestParam("documentId") Long documentId) {
        try {
            ShareRequest request = shareRequestService.createRequest(documentId);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ShareRequest>> getPendingRequests() {
        return ResponseEntity.ok(shareRequestService.getPendingRequests());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        try {
            ShareRequest request = shareRequestService.approveRequest(id);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            ShareRequest request = shareRequestService.rejectRequest(id);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
