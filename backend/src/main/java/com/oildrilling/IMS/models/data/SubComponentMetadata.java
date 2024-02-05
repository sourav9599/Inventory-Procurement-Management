package com.oildrilling.IMS.models.data;

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
public class SubComponentMetadata {
    @DynamoDBAttribute
    private String worksRequired;
    @DynamoDBAttribute
    private String detailsOfTesting;
    @DynamoDBAttribute
    private int totalQuantity;
}
