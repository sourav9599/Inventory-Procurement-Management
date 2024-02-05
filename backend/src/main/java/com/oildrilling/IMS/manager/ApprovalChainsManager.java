package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ApprovalChainsDAO;
import com.oildrilling.IMS.models.tables.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApprovalChainsManager {
    private final ApprovalChainsDAO approvalChainsDAO;
    @Autowired
    public ApprovalChainsManager(ApprovalChainsDAO approvalChainsDAO) {
        this.approvalChainsDAO = approvalChainsDAO;
    }

    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public ApprovalChains getApprovalChain(String rigId) {
        return approvalChainsDAO.getApprovalsChainsByRig(rigId);
    }
}
