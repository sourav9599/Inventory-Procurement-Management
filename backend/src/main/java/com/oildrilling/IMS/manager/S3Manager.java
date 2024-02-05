package com.oildrilling.IMS.manager;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class S3Manager {
    private final AmazonS3 s3;
    @Autowired
    public S3Manager(AmazonS3 s3) {
        this.s3 = s3;
    }
    public void save(String path, String fileName, Optional<Map<String, String>> optionalMetadata, InputStream inputStream)
    {
        ObjectMetadata metadata = new ObjectMetadata();
        optionalMetadata.ifPresent(map -> {
            if(!map.isEmpty()){
                map.forEach(metadata::addUserMetadata);
            }
        });

        try {
            s3.putObject(path, fileName, inputStream, metadata);
        } catch (AmazonServiceException e) {
            throw new IllegalStateException("Failed to store file to s3", e);
        }
    }
    public void uploadFile(String bucketName, String fileName, MultipartFile file){
        File fileObj = convertMultipartFileToFile(file);
        s3.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
        fileObj.delete();
    }
    private File convertMultipartFileToFile(MultipartFile file){
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fileOutputStream = new FileOutputStream(convertedFile)){
                fileOutputStream.write(file.getBytes());
        } catch (IOException e){
            throw new IllegalStateException(e);
        }
        return convertedFile;
    }
    public byte[] download(String bucketName, String key) {
        try {

            S3Object object = s3.getObject(bucketName, key);
            S3ObjectInputStream s3is = object.getObjectContent();
            return  s3is.readAllBytes();
        } catch (AmazonServiceException | IOException ioe) {
            throw new IllegalStateException("Failed to donwload", ioe);
        }

    }
}
