package com.oildrilling.IMS.manager;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.oildrilling.IMS.dao.QuotationDAO;
import com.oildrilling.IMS.models.dataclass.Quotation;
import com.oildrilling.IMS.models.tables.Quotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class QuotationManager {

    private final QuotationDAO quotationDAO;
    private final S3Manager s3Manager;
    @Autowired
    public QuotationManager(QuotationDAO quotationDAO, S3Manager s3Manager) {
        this.quotationDAO = quotationDAO;
        this.s3Manager = s3Manager;
    }

    public Quotations getQuote(String rigId, String materialRequestId) {
        String id = rigId + "_" + materialRequestId;
        return quotationDAO.getQuote(id);
    }
    public String uploadQuotationFile(String quotationId, String materialRequestId, MultipartFile file) {
        if(file.isEmpty()){
            throw new IllegalStateException("cannot upload file[" + file.getSize()+ "]");
        }
//        if(!Arrays.asList(ContentType.,ContentType.IMAGE_PNG.getMimeType(),ContentType.IMAGE_GIF.getMimeType()).contains(file.getContentType())){
//            throw new IllegalStateException("file is not an image");
//        }

        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        String path = String.format("%s", "quotation-kriss-drilling");
        String fileName = String.format("%s/%s-%s", materialRequestId, quotationId,file.getOriginalFilename());
        s3Manager.uploadFile(path, fileName, file);
        return fileName;

    }


    public void setAcceptedQuotation(String rigId, String materialRequestId, String quoteId) {
        Quotations quotations = getQuote(rigId, materialRequestId);
        if(quotations == null ){
            throw new IllegalStateException("Quotation doesn't exist");
        } else {
            quotations.setAcceptedQuoteId(quoteId);
        }
        quotationDAO.addQuote(quotations);
    }

    public byte[] getQuotationFile(String key){
        return s3Manager.download("quotation-kriss-drilling", key);
    }

    public String addQuote(String rigId, String materialRequestId, String vendorId, String vendorName, float price, float tax, long deliveryDate, MultipartFile file) {
        String id = rigId + "_" + materialRequestId;
        String quotationId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String quotationFileName = uploadQuotationFile(quotationId, materialRequestId, file);
        Quotation quotation = Quotation.builder().id(quotationId)
                .timestamp(System.currentTimeMillis())
                .vendorName(vendorName)
                .vendorId(vendorId)
                .price(price)
                .tax(tax)
                .deliveryDate(deliveryDate)
                .documentPath(quotationFileName)
                .build();

        Quotations quotations = getQuote(rigId, materialRequestId);
        if(quotations == null ){
            quotations = Quotations.builder().id(id).quotationList(List.of(quotation)).build();
        } else {
            quotations.getQuotationList().add(quotation);
        }
        quotationDAO.addQuote(quotations);
        return quotationId;
    }
}
