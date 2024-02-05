package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.dataclass.Quotation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamoDBTable(tableName = "Quotations")
public class Quotations {
    @DynamoDBHashKey
    private String id;

    @DynamoDBAttribute
    private String acceptedQuoteId;

    @DynamoDBAttribute
    private List<Quotation> quotationList;
}
