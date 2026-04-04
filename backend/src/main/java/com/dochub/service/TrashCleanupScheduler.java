package com.dochub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TrashCleanupScheduler {

    private final DocumentService documentService;

    @Value("${documents.trash.retention-days:10}")
    private int retentionDays;

    public TrashCleanupScheduler(DocumentService documentService) {
        this.documentService = documentService;
    }

    @Scheduled(cron = "${documents.trash.cleanup-cron:0 0 0 * * *}")
    public void purgeExpiredTrashDocuments() {
        documentService.purgeTrashDocumentsOlderThanDays(retentionDays);
    }
}
