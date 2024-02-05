package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ComponentManager;
import com.oildrilling.IMS.manager.MaterialRequestManager;
import com.oildrilling.IMS.models.tables.Component;
import com.oildrilling.IMS.models.tables.MaterialRequest;
import com.oildrilling.IMS.models.tables.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/material-request")
@CrossOrigin("*")
public class MaterialRequestController {
    private final MaterialRequestManager materialRequestManager;
    @Autowired
    public MaterialRequestController(MaterialRequestManager materialRequestManager) {
        this.materialRequestManager = materialRequestManager;
    }

    @PostMapping(path = "spare",consumes = {"*/*"})
    public String addMaterialRequest(@RequestBody MaterialRequest materialRequest){
        return materialRequestManager.addMaterialRequest(materialRequest.getRigId(), materialRequest.getComponentId(),
                materialRequest.getSubComponentId(), materialRequest.getQuantity(),
                materialRequest.getComments(), materialRequest.getMaterialId(), materialRequest.getMaterialName(),
                materialRequest.getDeadline(), materialRequest.getPendingApprovalGroup(),
                materialRequest.getManufacturerId(), materialRequest.getMaterialType(), materialRequest.getProjectId());
    }

    @PostMapping(path = "approve",consumes = {"*/*"})
    public void approveMaterialRequest(@RequestParam String materialRequestId, @RequestParam String groupName,
                                       @RequestParam String comment, @RequestParam String user){
        materialRequestManager.approveMaterialRequest(materialRequestId, groupName, comment, user);
    }

    @PostMapping(path = "deny",consumes = {"*/*"})
    public void denyMaterialRequest(@RequestParam String materialRequestId, @RequestParam String groupName,
                                       @RequestParam String comment, @RequestParam String targetGroupName, @RequestParam String user){
        materialRequestManager.denyMaterialRequest(materialRequestId, groupName, comment, targetGroupName, user);
    }

    @GetMapping(path = "pending-approvals")
    public List<MaterialRequest> getPendingApprovals(@RequestParam String groupName){
        return materialRequestManager.getPendingApprovals(groupName);
    }

    @GetMapping
    public List<MaterialRequest> getAllMaterialRequest(){
        return materialRequestManager.getAllMaterialRequests();
    }
}