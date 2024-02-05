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
public class VendorData {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private String name;
    @DynamoDBAttribute
    private String address;
    @DynamoDBAttribute
    private String contactInfo;
}
