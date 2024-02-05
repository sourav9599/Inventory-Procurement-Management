package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.ApprovalGroups;
import com.oildrilling.IMS.models.tables.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ApprovalGroupDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public void save(ApprovalGroups approvalGroups){
        dynamoDBMapper.save(approvalGroups);
    }

    public Component getComponentById(String componentId){
        return dynamoDBMapper.load(Component.class, componentId);
    }

    public String delete(String componentId) {
        Component component = dynamoDBMapper.load(Component.class, componentId);
        dynamoDBMapper.delete(component);
        return component.getId() + " is deleted";
    }

    public String update(String componentId, Component component){
        dynamoDBMapper.save(component,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(componentId)
                                )
                        )
        );
        return component.getId() + " is updated";
    }

    public ApprovalGroups getGroup(String groupName) {
        return dynamoDBMapper.load(ApprovalGroups.class, groupName);
    }
}
