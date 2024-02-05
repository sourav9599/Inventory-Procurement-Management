package com.oildrilling.IMS.controller;


import com.oildrilling.IMS.manager.SpareManager;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import com.oildrilling.IMS.models.tables.Rig;
import com.oildrilling.IMS.models.tables.Spare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/spare")
@CrossOrigin("*")
public class SpareController {
    private final SpareManager spareManager;
    @Autowired
    public SpareController(SpareManager spareManager) {
        this.spareManager = spareManager;
    }
    @PostMapping(path="add-quantity",consumes = {"*/*"})
    public Spare addSpareQuantity(@RequestParam String rigId, @RequestParam String componentId, @RequestParam String subComponentId,
                                  @RequestParam String spareId, @RequestParam int quantity, @RequestParam String user)
    {
        return spareManager.addSpareQuantity(rigId, componentId, subComponentId, spareId, quantity, user);
    }
    @PostMapping(path="remove-quantity", consumes = {"*/*"} )
    public Spare removeSpareQuantity(@RequestParam String rigId, @RequestParam String componentId, @RequestParam String subComponentId, @RequestParam String spareId, @RequestParam String comment, @RequestParam int quantity
    ,@RequestParam String user)
    {
        return spareManager.removeSpareQuantity(rigId,componentId,subComponentId,spareId,quantity, comment, user);
    }

    @PostMapping(consumes = {"*/*"})
    public void addNewSpare(@RequestBody Spare spare){
        spareManager.addNewSpare(spare);
    }

    @GetMapping
    public Spare getSpareById(@RequestParam String spareId){
        return spareManager.getSpareById(spareId);
    }

    @PostMapping(path = "get-details")
    public List<Map<String, Object>> getSpareById(@RequestParam String rigId, @RequestParam String componentId,
                                                  @RequestParam String subComponentId,@RequestBody List<MetadataDetails> spareDetails){
        return spareManager.getSpareList(spareDetails, rigId, componentId, subComponentId);
    }

    @PostMapping(path = "edit")
    public void updateSpare(@RequestBody Spare spare){
        spareManager.updateSpare(spare);
    }

}
