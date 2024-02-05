package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MetadataDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Metadata save(Metadata metadata){
        dynamoDBMapper.save(metadata);
        return metadata;
    }

    public Metadata getMetadataById(String metadataId){
        return dynamoDBMapper.load(Metadata.class, metadataId);
    }

    public List<Metadata> getMetadataByName(String metadataName){
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":val1", new AttributeValue().withS(metadataName));
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("metadataName = :val1").withExpressionAttributeValues(eav);

        return dynamoDBMapper.scan(Metadata.class, scanExpression);

    }
    public String delete(String metadataId) {
        Metadata metadata = dynamoDBMapper.load(Metadata.class, metadataId);
        dynamoDBMapper.delete(metadata);
        return metadata.getMetadataId() + " is deleted";
    }

    public Metadata update(String metadataId, Metadata metadata){
        dynamoDBMapper.save(metadata,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("metadataId",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(metadataId)
                                )
                        )
        );
        return metadata;
    }
}
