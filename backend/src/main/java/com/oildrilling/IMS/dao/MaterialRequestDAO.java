package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.oildrilling.IMS.models.tables.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaterialRequestDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public void save(MaterialRequest materialRequest){
        dynamoDBMapper.save(materialRequest);
    }

    public List<MaterialRequest> getAllMaterialRequest(){
        return dynamoDBMapper.scan(MaterialRequest.class, new DynamoDBScanExpression());
    }
    public MaterialRequest getMaterialRequest(String materialRequestId) {
        Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
        eav.put(":v1",new AttributeValue().withS(materialRequestId));

        DynamoDBQueryExpression<MaterialRequest> queryExpression = new DynamoDBQueryExpression<MaterialRequest>()
                .withKeyConditionExpression("materialRequestId = :v1")
                .withExpressionAttributeValues(eav);
        List<MaterialRequest> materialRequestList = dynamoDBMapper.query(MaterialRequest.class,queryExpression);
        return materialRequestList.get(0);
    }
}
