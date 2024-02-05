package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ApprovalGroupDAO;
import com.oildrilling.IMS.models.tables.ApprovalGroups;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ApprovalGroupManager {
    private final ApprovalGroupDAO approvalGroupDAO;
    @Autowired
    public ApprovalGroupManager(ApprovalGroupDAO approvalGroupDAO) {
        this.approvalGroupDAO = approvalGroupDAO;
    }

    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public ApprovalGroups getApprovalGroup(String groupName) {
        return approvalGroupDAO.getGroup(groupName);
    }

    public void removeMaterialRequest(String groupName, String materialRequestId) {
        ApprovalGroups approvalGroups = approvalGroupDAO.getGroup(groupName);
        approvalGroups.getPendingMaterialRequests().remove(materialRequestId);
        approvalGroupDAO.save(approvalGroups);
    }

    public void addMaterialRequest(String groupName, String materialRequestId) {
        if(groupName.isEmpty()) {
            return;
        }
        ApprovalGroups approvalGroups = approvalGroupDAO.getGroup(groupName);
        if(approvalGroups==null) {
            approvalGroupDAO.save(ApprovalGroups.builder()
                    .groupName(groupName)
                    .pendingMaterialRequests(Collections.singletonList(materialRequestId))
                    .build());
            return;
        }
        approvalGroups.getPendingMaterialRequests().add(materialRequestId);
        approvalGroupDAO.save(approvalGroups);
    }
}
