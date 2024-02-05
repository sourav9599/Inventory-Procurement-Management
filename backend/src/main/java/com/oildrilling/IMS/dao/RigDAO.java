package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.*;
import com.oildrilling.IMS.models.tables.Rig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class RigDAO {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    @Autowired
    private AmazonDynamoDB amazonDynamoDB;

    public String createMaterialTable(String tableName){
        DynamoDB dynamoDB = new DynamoDB(amazonDynamoDB);

        List<AttributeDefinition> attributeDefinitions= new ArrayList<>();
        attributeDefinitions.add(new AttributeDefinition().withAttributeName("materialId").withAttributeType(ScalarAttributeType.S));
        List<KeySchemaElement> keySchema = new ArrayList<>();
        keySchema.add(new KeySchemaElement().withAttributeName("materialId").withKeyType(KeyType.HASH));

        CreateTableRequest request = new CreateTableRequest()
                .withTableName(tableName)
                .withKeySchema(keySchema)
                .withAttributeDefinitions(attributeDefinitions)
                .withProvisionedThroughput(new ProvisionedThroughput()
                        .withReadCapacityUnits(5L)
                        .withWriteCapacityUnits(6L));

        Table table = dynamoDB.createTable(request);

        try {
            table.waitForActive();
            return table.getTableName();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public Rig save(Rig rig){
        dynamoDBMapper.save(rig);
        return rig;
    }

    public Rig getRigById(String rigId){
        return dynamoDBMapper.load(Rig.class, rigId);
    }

    public PaginatedScanList<Rig> getAllRigs(){
        return dynamoDBMapper.scan(Rig.class, new DynamoDBScanExpression());
    }

    public List<Rig> getRigByName(String rigName){
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":val1", new AttributeValue().withS(rigName));
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("rigName = :val1").withExpressionAttributeValues(eav);

        return dynamoDBMapper.scan(Rig.class, scanExpression);

    }
    public String delete(String rigId) {
        Rig rig = dynamoDBMapper.load(Rig.class, rigId);
        dynamoDBMapper.delete(rig);
        return rig.getRigName() + " is deleted";
    }

    public Rig update(String rigId, Rig rig){
        dynamoDBMapper.save(rig,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("rigId",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(rigId)
                                )
                        )
        );
        return rig;
    }
}
