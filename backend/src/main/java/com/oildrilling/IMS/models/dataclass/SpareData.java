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
public class SpareData {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private String name;
    @DynamoDBAttribute
    private String model;
    @DynamoDBAttribute
    private String description;
    @DynamoDBAttribute
    private String specification;
    @DynamoDBAttribute
    private int totalQuantity;
    @DynamoDBAttribute
    private int minimumThreshold;
    @DynamoDBAttribute
    private String usageType;
    @DynamoDBAttribute
    private String category;
}
