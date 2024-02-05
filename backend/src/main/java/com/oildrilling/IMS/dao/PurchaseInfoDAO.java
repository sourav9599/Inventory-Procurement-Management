package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.PurchaseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class PurchaseInfoDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public PurchaseInfo save(PurchaseInfo purchaseInfo){
        dynamoDBMapper.save(purchaseInfo);
        return purchaseInfo;
    }

    public PurchaseInfo getPurchaseInfoById(String purchaseInfoId){
        return dynamoDBMapper.load(PurchaseInfo.class, purchaseInfoId);
    }

    public String delete(String purchaseInfoId) {
        PurchaseInfo purchaseInfo = dynamoDBMapper.load(PurchaseInfo.class, purchaseInfoId);
        dynamoDBMapper.delete(purchaseInfo);
        return purchaseInfo.getId() + " is deleted";
    }

    public String update(String purchaseInfoId, PurchaseInfo purchaseInfo){
        dynamoDBMapper.save(purchaseInfo,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(purchaseInfoId)
                                )
                        )
        );
        return purchaseInfo.getId() + " is updated";
    }
}
