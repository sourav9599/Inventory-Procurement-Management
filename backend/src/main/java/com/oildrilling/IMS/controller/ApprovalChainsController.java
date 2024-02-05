package com.oildrilling.IMS.controller;

import com.oildrilling.IMS.manager.ApprovalChainsManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/approval-chain")
@CrossOrigin("*")
public class ApprovalChainsController {

    private final ApprovalChainsManager approvalChainsManager;
    @Autowired
    public ApprovalChainsController(ApprovalChainsManager approvalChainsManager) {
        this.approvalChainsManager = approvalChainsManager;
    }

    @GetMapping
    public List<String> getApprovalChainById(@RequestParam String rigId){
        return approvalChainsManager.getApprovalChain(rigId).getGroups();
    }

}
