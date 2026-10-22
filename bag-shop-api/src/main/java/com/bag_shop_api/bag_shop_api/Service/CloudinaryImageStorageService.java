package com.bag_shop_api.bag_shop_api.Service;
import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
@Primary
@Service
public class CloudinaryImageStorageService
        implements ImageStorageService {

    private final Cloudinary cloudinary;

    public CloudinaryImageStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String upload(
            MultipartFile file,
            String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IOException("Please select an image to upload.");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.toLowerCase().startsWith("image/")) {
            throw new IOException("Only image files are allowed.");
        }

        if (folder == null || folder.isBlank()) {
            folder = "kelly-bags";
        }

        // Prevent unexpected characters in the folder name.
        String safeFolder = folder.trim()
                .replaceAll("[^a-zA-Z0-9/_-]", "");

        if (safeFolder.isBlank()) {
            safeFolder = "kelly-bags";
        }

        String publicId = UUID.randomUUID().toString();

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", safeFolder,
                            "public_id", publicId,
                            "resource_type", "image",
                            "overwrite", false
                    )
            );

            Object secureUrl = result.get("secure_url");

            if (secureUrl == null) {
                throw new IOException(
                        "Cloudinary did not return a secure image URL."
                );
            }

            // Save this URL in the database using your existing logic.
            return secureUrl.toString();

        } catch (IOException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new IOException(
                    "Failed to upload image to Cloudinary.",
                    exception
            );
        }
    }

    @Override
    public void delete(String imageUrl) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String publicId = extractPublicId(imageUrl);

        /*
         * Older images may still have local URLs such as /uploads/...
         * Do not send those URLs to Cloudinary.
         */
        if (publicId == null) {
            return;
        }

        try {
            Map<?, ?> result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type", "image",
                            "invalidate", true
                    )
            );

            Object status = result.get("result");

            if (status != null &&
                    !"ok".equalsIgnoreCase(status.toString()) &&
                    !"not found".equalsIgnoreCase(status.toString())) {

                throw new IOException(
                        "Cloudinary could not delete the image: " + status
                );
            }

        } catch (IOException exception) {
            throw exception;

        } catch (Exception exception) {
            throw new IOException(
                    "Failed to delete image from Cloudinary.",
                    exception
            );
        }
    }

    private String extractPublicId(String imageUrl) {

        try {
            URI uri = URI.create(imageUrl);

            String path = uri.getPath();

            if (path == null) {
                return null;
            }

            String marker = "/image/upload/";
            int markerIndex = path.indexOf(marker);

            if (markerIndex < 0) {
                return null;
            }

            String assetPath = path.substring(
                    markerIndex + marker.length()
            );

            String[] segments = assetPath.split("/");

            // Cloudinary URLs normally contain a version segment,
            // for example v1234567890.
            int startIndex = 0;

            for (int i = 0; i < segments.length; i++) {
                if (segments[i].matches("v\\d+")) {
                    startIndex = i + 1;
                    break;
                }
            }

            if (startIndex >= segments.length) {
                return null;
            }

            StringBuilder publicId = new StringBuilder();

            for (int i = startIndex; i < segments.length; i++) {

                if (publicId.length() > 0) {
                    publicId.append("/");
                }

                publicId.append(segments[i]);
            }

            // Cloudinary image public IDs normally exclude extensions.
            int lastDot = publicId.lastIndexOf(".");

            if (lastDot > publicId.lastIndexOf("/")) {
                publicId.delete(lastDot, publicId.length());
            }

            return publicId.isEmpty() ? null : publicId.toString();

        } catch (IllegalArgumentException exception) {
            return null;
        }
    }
}
