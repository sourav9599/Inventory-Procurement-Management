package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Logs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class LogsDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Logs save(Logs logs){
        dynamoDBMapper.save(logs);
        return logs;
    }

    public Logs getLogsById(String logsId){
        return dynamoDBMapper.load(Logs.class, logsId);
    }

    public String delete(String logsId) {
        Logs logs = dynamoDBMapper.load(Logs.class, logsId);
        dynamoDBMapper.delete(logs);
        return logs.getId() + " is deleted";
    }

    public String update(String logsId, Logs logs){
        dynamoDBMapper.save(logs,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(logsId)
                                )
                        )
        );
        return logs.getId() + " is updated";
    }
}
