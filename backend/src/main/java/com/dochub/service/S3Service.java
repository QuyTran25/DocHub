package com.dochub.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

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

	public boolean isS3StorageActive() {
		return s3Enabled && !bucketName.isBlank();
	}

	public String uploadFile(MultipartFile file) throws IOException {
		String safeFileName = sanitizeFileName(file.getOriginalFilename());
		String objectKey = "uploads/" + UUID.randomUUID() + "_" + safeFileName;

		if (isS3StorageActive()) {
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

	public String createPresignedPreviewUrl(String objectKey, String fileName) {
		if (!isS3StorageActive()) {
			throw new IllegalStateException("S3 storage is not enabled");
		}

		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
				.bucket(bucketName)
				.key(objectKey)
				.responseContentDisposition("inline; filename=\"" + sanitizeFileName(fileName) + "\"")
				.build();

		GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
				.signatureDuration(Duration.ofMinutes(30))
				.getObjectRequest(getObjectRequest)
				.build();

		try (S3Presigner presigner = S3Presigner.builder().region(Region.of(region)).build()) {
			return presigner.presignGetObject(presignRequest).url().toString();
		}
	}

	public void deleteFile(String s3Key, String storedPath) {
		if (isS3StorageActive()) {
			if (s3Key == null || s3Key.isBlank()) {
				throw new IllegalArgumentException("S3 key is empty");
			}

			try (S3Client s3Client = S3Client.builder().region(Region.of(region)).build()) {
				DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
						.bucket(bucketName)
						.key(s3Key)
						.build();
				s3Client.deleteObject(deleteObjectRequest);
			}
			return;
		}

		Path localPath = resolveLocalPath(storedPath);
		try {
			Files.deleteIfExists(localPath);
		} catch (IOException ex) {
			throw new IllegalStateException("Cannot delete local file: " + localPath, ex);
		}
	}

	public Path resolveLocalPath(String storedPath) {
		if (storedPath == null || storedPath.isBlank()) {
			throw new IllegalArgumentException("Stored file path is empty");
		}

		String fileName = storedPath;
		if (storedPath.startsWith("local/")) {
			fileName = storedPath.substring("local/".length());
		} else if (storedPath.startsWith("uploads/")) {
			fileName = storedPath.substring(storedPath.lastIndexOf('/') + 1);
		} else if (storedPath.contains("/")) {
			fileName = storedPath.substring(storedPath.lastIndexOf('/') + 1);
		}

		return Path.of(localUploadDir).resolve(fileName).normalize();
	}

	private String sanitizeFileName(String fileName) {
		if (fileName == null || fileName.isBlank()) {
			return "unknown-file";
		}
		return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
	}
}
