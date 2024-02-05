package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Spare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SpareDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Spare save(Spare spare){
        dynamoDBMapper.save(spare);
        return spare;
    }

    public Spare getSpareById(String spareId){
        return dynamoDBMapper.load(Spare.class, spareId);
    }

    public String delete(String spareId) {
        Spare spare = dynamoDBMapper.load(Spare.class, spareId);
        dynamoDBMapper.delete(spare);
        return spare.getId() + " is deleted";
    }

    public Spare update(String spareId, Spare spare){
        dynamoDBMapper.save(spare,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(spareId)
                                )
                        )
        );
        return spare;
    }
}
