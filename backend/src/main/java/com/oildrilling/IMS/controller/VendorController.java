package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.VendorManager;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/vendor")
@CrossOrigin("*")
public class VendorController {
    private final VendorManager vendorManager;

    public VendorController(VendorManager vendorManager) {
        this.vendorManager = vendorManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addNewVendor(@RequestBody Vendor vendor){
        vendorManager.addNewVendor(vendor);
    }

    @GetMapping(path="recommended")
    public List<MetadataDetails> getRecommendedVendors(@RequestParam String materialId, @RequestParam String purchaseInfoId){
        return  vendorManager.getRecommendedVendors(materialId, purchaseInfoId);
    }
}
