package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.ApprovalChains;
import com.oildrilling.IMS.models.tables.ApprovalGroups;
import com.oildrilling.IMS.models.tables.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ApprovalChainsDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public void save(ApprovalGroups approvalGroups){
        dynamoDBMapper.save(approvalGroups);
    }

    public ApprovalChains getApprovalsChainsByRig(String rigId){
        return dynamoDBMapper.load(ApprovalChains.class, rigId);
    }
}
