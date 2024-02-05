package com.oildrilling.IMS.controller;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.oildrilling.IMS.manager.DocumentGeneratorManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;


@RestController
@RequestMapping("api/v1/generate")
@CrossOrigin("*")
public class DocumentGeneratorController {

    @Autowired
    private DocumentGeneratorManager documentGeneratorManager;

    @GetMapping(value = "work-order")
    public ResponseEntity<byte[]> generateDocument(@RequestParam String rigId, @RequestParam String materialRequestId, @RequestParam String materialType,
                                                   @RequestParam String materialId, @RequestParam String rigName, @RequestParam String componentName,
                                                   @RequestParam int quantity) {
        return documentGeneratorManager.generateWorkOrderDocument(rigId, rigName, componentName, materialRequestId, materialType, materialId, quantity);
    }


}

