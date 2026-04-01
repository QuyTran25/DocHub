package com.dochub.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

	@Value("${aws.s3.enabled:false}")
	private boolean s3Enabled;

	@Value("${aws.s3.bucket-name:}")
	private String bucketName;

	@Value("${aws.region:ap-southeast-1}")
	private String region;

	@Value("${storage.local.upload-dir:uploads}")
	private String localUploadDir;

	public String uploadFile(MultipartFile file) throws IOException {
		String safeFileName = sanitizeFileName(file.getOriginalFilename());
		String objectKey = "uploads/" + UUID.randomUUID() + "_" + safeFileName;

		if (s3Enabled && !bucketName.isBlank()) {
			try (S3Client s3Client = S3Client.builder().region(Region.of(region)).build()) {
				PutObjectRequest putObjectRequest = PutObjectRequest.builder()
						.bucket(bucketName)
						.key(objectKey)
						.contentType(file.getContentType())
						.build();

				s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
				return objectKey;
			}
		}

		Path uploadDirectory = Path.of(localUploadDir);
		Files.createDirectories(uploadDirectory);
		Path destination = uploadDirectory.resolve(objectKey.replace("uploads/", ""));
		Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
		return "local/" + destination.getFileName();
	}

	private String sanitizeFileName(String fileName) {
		if (fileName == null || fileName.isBlank()) {
			return "unknown-file";
		}
		return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
	}
}
