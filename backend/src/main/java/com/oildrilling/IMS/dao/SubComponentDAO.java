package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;

import com.oildrilling.IMS.models.tables.SubComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SubComponentDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public SubComponent save(SubComponent subComponent){
        dynamoDBMapper.save(subComponent);
        return subComponent;
    }

    public SubComponent getSubComponentById(String subComponentId){
        return dynamoDBMapper.load(SubComponent.class, subComponentId);
    }

    public String delete(String subComponentId) {
        SubComponent subComponent = dynamoDBMapper.load(SubComponent.class, subComponentId);
        dynamoDBMapper.delete(subComponent);
        return subComponent.getId() + " is deleted";
    }

    public SubComponent update(String subComponentId, SubComponent subComponent){
        dynamoDBMapper.save(subComponent,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(subComponentId)
                                )
                        )
        );
        return subComponent;
    }
}
