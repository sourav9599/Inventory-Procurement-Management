package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.QuotationManager;
import com.oildrilling.IMS.models.dataclass.Quotation;
import com.oildrilling.IMS.models.tables.Quotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@RestController
@RequestMapping("api/v1/quotation")
@CrossOrigin("*")
public class QuotationController {

    private final QuotationManager quotationManager;
    @Autowired
    public QuotationController(QuotationManager quotationManager) {
        this.quotationManager = quotationManager;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String addQuotation(@RequestParam("file") MultipartFile file, @RequestParam String rigId, @RequestParam String materialRequestId, @RequestParam String vendorId, @RequestParam String vendorName,
                             @RequestParam float price, @RequestParam float tax, @RequestParam long deliveryDate){
        return quotationManager.addQuote(rigId, materialRequestId, vendorId, vendorName, price,tax, deliveryDate, file);
    }

    @PostMapping(path="acceptedQuote",consumes = {"*/*"})
    public void setAcceptedQuotation(@RequestParam String rigId, @RequestParam String materialRequestId, @RequestParam String quoteId){
        quotationManager.setAcceptedQuotation(rigId, materialRequestId, quoteId);
    }

    @GetMapping
    public Quotations getQuotationById(@RequestParam String rigId, @RequestParam String materialRequestId){
        Quotations quotations = quotationManager.getQuote(rigId, materialRequestId);
        if(quotations == null){
            return Quotations.builder().quotationList(new ArrayList<>()).build();
        }
        return quotations;
    }
    @GetMapping("downloadQuoteDocument")
    public byte[] getUserProfileImage(@RequestParam String path) {
        return quotationManager.getQuotationFile(path);
    }
}
