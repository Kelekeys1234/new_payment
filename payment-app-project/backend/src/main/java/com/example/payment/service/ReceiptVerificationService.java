package com.example.payment.service;

import com.example.payment.model.Currency;
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Stores a transfer receipt only after OCR confirms the submitted amount appears on it. */
@Service
public class ReceiptVerificationService {
    private static final long MAX_RECEIPT_BYTES = 8L * 1024 * 1024;
    private static final Pattern AMOUNT_PATTERN = Pattern.compile("(?<![0-9])(?:[₦$€£]|NGN|USD|EUR|GBP)?\\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{1,2})?|[0-9]+(?:\\.[0-9]{1,2})?)(?![0-9])", Pattern.CASE_INSENSITIVE);
    private final Path receiptDirectory;

    public ReceiptVerificationService(@Value("${app.receipts.upload-dir}") String uploadDirectory) {
        this.receiptDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    public String verifyAndStore(MultipartFile receipt, BigDecimal expectedAmount, Currency currency) {
        validateFile(receipt);
        String text = extractText(receipt);
        if (!containsAmount(text, expectedAmount)) {
            throw new IllegalArgumentException("The amount on the transfer receipt does not match the amount entered. Please upload the correct receipt or update the amount.");
        }
        return store(receipt);
    }

    private void validateFile(MultipartFile receipt) {
        if (receipt == null || receipt.isEmpty()) throw new IllegalArgumentException("A transfer receipt screenshot is required.");
        if (receipt.getSize() > MAX_RECEIPT_BYTES) throw new IllegalArgumentException("Receipt screenshot must be 8 MB or smaller.");
        String contentType = receipt.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) throw new IllegalArgumentException("Receipt must be an image file (JPG, PNG, or WEBP).");
    }

    private String extractText(MultipartFile receipt) {
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            Image image = Image.newBuilder().setContent(ByteString.copyFrom(receipt.getBytes())).build();
            Feature feature = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
            AnnotateImageResponse response = client.batchAnnotateImages(java.util.List.of(
                    AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(image).build())).getResponses(0);
            if (response.hasError()) throw new IllegalArgumentException("Could not read the transfer receipt. Please upload a clearer screenshot.");
            return response.getFullTextAnnotation().getText();
        } catch (IOException e) {
            throw new IllegalStateException("Receipt verification is temporarily unavailable. Please try again later.", e);
        }
    }

    private boolean containsAmount(String text, BigDecimal expectedAmount) {
        Matcher matcher = AMOUNT_PATTERN.matcher(text.replace('\n', ' '));
        while (matcher.find()) {
            try {
                if (new BigDecimal(matcher.group(1).replace(",", "")).compareTo(expectedAmount) == 0) return true;
            } catch (NumberFormatException ignored) { }
        }
        return false;
    }

    private String store(MultipartFile receipt) {
        try {
            Files.createDirectories(receiptDirectory);
            String type = receipt.getContentType().toLowerCase(Locale.ROOT);
            String extension = type.contains("png") ? ".png" : type.contains("webp") ? ".webp" : ".jpg";
            String fileName = UUID.randomUUID() + extension;
            Files.copy(receipt.getInputStream(), receiptDirectory.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new IllegalStateException("Could not save the transfer receipt. Please try again.", e);
        }
    }
}
