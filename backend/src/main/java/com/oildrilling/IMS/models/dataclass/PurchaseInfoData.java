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
public class PurchaseInfoData {
    @DynamoDBAttribute
    private String id;
    @DynamoDBAttribute
    private String manufacturerName;
    @DynamoDBAttribute
    private String manufacturerId;
    @DynamoDBAttribute
    private String vendorName;
    @DynamoDBAttribute
    private String vendorId;
    @DynamoDBAttribute
    private String projectAssociatedName;
    @DynamoDBAttribute
    private String projectAssociatedId;
    @DynamoDBAttribute
    private int quantity;
    @DynamoDBAttribute
    private Float price;
    @DynamoDBAttribute
    private Float tax;
    @DynamoDBAttribute
    private long date;
}
