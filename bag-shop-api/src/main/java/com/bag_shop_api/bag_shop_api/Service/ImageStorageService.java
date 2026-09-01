package com.bag_shop_api.bag_shop_api.Service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
	   String upload(MultipartFile file, String folder) throws IOException;

	    void delete(String imageUrl) throws IOException;
	
}
