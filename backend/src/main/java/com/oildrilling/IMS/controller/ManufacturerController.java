package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ManufacturerManager;
import com.oildrilling.IMS.models.tables.Manufacturer;
import com.oildrilling.IMS.models.tables.Spare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/manufacturer")
@CrossOrigin("*")
public class ManufacturerController {

    private final ManufacturerManager manufacturerManager;
    @Autowired
    public ManufacturerController(ManufacturerManager manufacturerManager) {
        this.manufacturerManager = manufacturerManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addNewManufacturer(@RequestBody Manufacturer manufacturer){
        manufacturerManager.addNewManufacturer(manufacturer);
    }
}
