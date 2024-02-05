package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.MetadataManager;
import com.oildrilling.IMS.models.tables.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/metadata")
@CrossOrigin("*")
public class MetadataController {
    private final MetadataManager metadataManager;
    @Autowired
    public MetadataController(MetadataManager metadataManager) {
        this.metadataManager = metadataManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addNewMetadata(@RequestParam String metadataName) {
        metadataManager.addNewMetadata(metadataName);
    }

    @PostMapping(path="{metadataName}",consumes = {"*/*"})
    public void updateMetadataDetails(@PathVariable String metadataName, @RequestParam String metadataValue) {
        metadataManager.updateMetadataDetails(metadataName, metadataValue);
    }

    @GetMapping
    public Metadata getMetadataByName(@RequestParam String metadataName){
        return metadataManager.getMetadataByName(metadataName);
    }


}
