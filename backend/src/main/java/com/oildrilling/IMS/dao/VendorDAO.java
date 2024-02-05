package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class VendorDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Vendor save(Vendor vendor){
        dynamoDBMapper.save(vendor);
        return vendor;
    }

    public Vendor getVendorById(String vendorId){
        return dynamoDBMapper.load(Vendor.class, vendorId);
    }

    public String delete(String vendorId) {
        Vendor vendor = dynamoDBMapper.load(Vendor.class, vendorId);
        dynamoDBMapper.delete(vendor);
        return vendor.getId() + " is deleted";
    }

    public String update(String vendorId, Vendor vendor){
        dynamoDBMapper.save(vendor,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(vendorId)
                                )
                        )
        );
        return vendor.getId() + " is updated";
    }
}
