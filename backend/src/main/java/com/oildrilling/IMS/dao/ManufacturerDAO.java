package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Manufacturer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ManufacturerDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Manufacturer save(Manufacturer manufacturer){
        dynamoDBMapper.save(manufacturer);
        return manufacturer;
    }

    public Manufacturer getManufacturerById(String manufacturerId){
        return dynamoDBMapper.load(Manufacturer.class, manufacturerId);
    }

    public String delete(String manufacturerId) {
        Manufacturer manufacturer = dynamoDBMapper.load(Manufacturer.class, manufacturerId);
        dynamoDBMapper.delete(manufacturer);
        return manufacturer.getId() + " is deleted";
    }

    public String update(String manufacturerId, Manufacturer manufacturer){
        dynamoDBMapper.save(manufacturer,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(manufacturerId)
                                )
                        )
        );
        return manufacturer.getId() + " is updated";
    }
}
