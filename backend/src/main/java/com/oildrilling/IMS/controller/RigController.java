package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.RigManager;
import com.oildrilling.IMS.models.dataclass.SubComponentData;
import com.oildrilling.IMS.models.tables.Rig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/rig")
@CrossOrigin("*")
public class RigController {

    private final RigManager rigManager;
    @Autowired
    public RigController(RigManager rigManager) {
        this.rigManager = rigManager;
    }

    @PostMapping(consumes = {"*/*"})
    public void addRig(@RequestParam String rigName, @RequestParam String location, @RequestParam String dateOfInception){
        rigManager.addRig(rigName,location,dateOfInception);
    }

    @PostMapping(path = "edit")
    public void updateRig(@RequestBody Rig rig){
        rigManager.updateRig(rig);
    }

    @GetMapping
    public Rig getRigById(@RequestParam String rigId){
        return rigManager.getRigById(rigId);
    }


}
