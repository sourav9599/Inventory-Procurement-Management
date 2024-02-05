package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.SubComponentManager;
import com.oildrilling.IMS.models.data.SubComponentMetadata;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import com.oildrilling.IMS.models.tables.SubComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/subcomponent")
@CrossOrigin("*")
public class SubComponentController {
    private final SubComponentManager subComponentManager;
    @Autowired
    public SubComponentController(SubComponentManager subComponentManager) {
        this.subComponentManager = subComponentManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addSubComponent(@RequestBody SubComponent subComponent){
        subComponentManager.addSubComponent(subComponent);
    }

    @PostMapping(path="add-quantity",consumes = {"*/*"})
    public SubComponent addSubComponentQuantity(@RequestParam String rigId, @RequestParam String componentId, @RequestParam String subComponentId,
                                                @RequestParam int quantity, @RequestParam String user)
    {
        return subComponentManager.addSubComponentQuantity(rigId, componentId, subComponentId, quantity, user);
    }
    @PostMapping(path="remove-quantity", consumes = {"*/*"} )
    public SubComponent removeSubComponentQuantity(@RequestParam String rigId, @RequestParam String componentId, @RequestParam String subComponentId,
                                                   @RequestParam String comment, @RequestParam int quantity, @RequestParam String user)
    {
        return subComponentManager.removeSubComponentQuantity(rigId,componentId,subComponentId, quantity, comment, user);
    }

    @GetMapping
    public SubComponent getSubComponentById(@RequestParam String subComponentId){
        return subComponentManager.getSubComponentById(subComponentId);
    }

    @PostMapping(path="update-subcomponent" ,consumes = {"*/*"})
    public void updateSubComponentDetails(@RequestParam String rigId, @RequestParam String componentId, @RequestParam String subComponentId, @RequestBody SubComponentMetadata subComponentMetadata){
        subComponentManager.updateSubComponentDetails(rigId, componentId, subComponentId, subComponentMetadata);
    }

    @PostMapping(path = "edit")
    public void updateSubComponent(@RequestBody SubComponent subComponent){
        subComponentManager.updateSubComponent(subComponent);
    }
}
