package com.bag_shop_api.bag_shop_api.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class LocalImageStorageService implements ImageStorageService {

    private final Path uploadDirectory =
            Paths.get("uploads");

    public LocalImageStorageService() throws IOException {

        Files.createDirectories(uploadDirectory);
    }

    @Override
    public String upload(
            MultipartFile file,
            String folder) throws IOException {

        Path folderPath = uploadDirectory.resolve(folder);

        Files.createDirectories(folderPath);

        String originalFileName = file.getOriginalFilename();

        String extension = "";

        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension = originalFileName.substring(
                    originalFileName.lastIndexOf("."));
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path filePath =
                folderPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + folder + "/" + fileName;
    }

    @Override
    public void delete(String imageUrl) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String relativePath =
                imageUrl.replaceFirst("^/uploads/", "");

        Path filePath =
                uploadDirectory.resolve(relativePath);

        Files.deleteIfExists(filePath);
    }
}
