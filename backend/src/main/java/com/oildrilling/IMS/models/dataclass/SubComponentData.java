package com.oildrilling.IMS.models.dataclass;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@DynamoDBDocument
public class SubComponentData {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private String name;
    @DynamoDBAttribute
    private String description;
    @DynamoDBAttribute
    private String model;
    @DynamoDBAttribute
    private String worksRequired;
    @DynamoDBAttribute
    private String detailsOfTesting;
    @DynamoDBAttribute
    private String specification;
    @DynamoDBAttribute
    private int totalQuantity;
    @DynamoDBAttribute
    private List<MetadataDetails> spareList;
}
