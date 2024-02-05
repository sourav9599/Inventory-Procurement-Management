package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ApprovalGroupManager;
import com.oildrilling.IMS.manager.RigManager;
import com.oildrilling.IMS.models.dataclass.SubComponentData;
import com.oildrilling.IMS.models.tables.ApprovalGroups;
import com.oildrilling.IMS.models.tables.Rig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/approval-group")
@CrossOrigin("*")
public class ApprovalGroupController {
    private final ApprovalGroupManager approvalGroupManager;

    @Autowired
    public ApprovalGroupController(ApprovalGroupManager approvalGroupManager) {
        this.approvalGroupManager = approvalGroupManager;
    }

    @GetMapping
    public ApprovalGroups getApprovalGroup(@RequestParam String groupName){
        return approvalGroupManager.getApprovalGroup(groupName);
    }

}
