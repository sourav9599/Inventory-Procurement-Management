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
public class Quotation {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private long timestamp;
    @DynamoDBAttribute
    private String vendorId;
    @DynamoDBAttribute
    private String vendorName;
    @DynamoDBAttribute
    private float price;
    @DynamoDBAttribute
    private float tax;
    @DynamoDBAttribute
    private long deliveryDate;
    @DynamoDBAttribute
    private String documentPath;
}
