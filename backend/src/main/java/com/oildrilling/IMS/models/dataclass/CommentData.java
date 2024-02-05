package com.oildrilling.IMS.models.dataclass;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import lombok.*;

@Data
@AllArgsConstructor
@Builder
@ToString
@NoArgsConstructor
@DynamoDBDocument
public class CommentData {
    @DynamoDBAttribute
    private String user;
    @DynamoDBAttribute
    private String group;
    @DynamoDBAttribute
    private long timestamp;
    @DynamoDBAttribute
    private String message;
}
