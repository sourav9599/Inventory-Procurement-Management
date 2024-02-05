package com.oildrilling.IMS.models.dataclass;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@DynamoDBDocument
public class LogsData {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private long timestamp;
    @DynamoDBAttribute
    private String actionType;
    @DynamoDBAttribute
    private String user;
    @DynamoDBAttribute
    private int quantity;
    @DynamoDBAttribute
    private String logMessage;
}
