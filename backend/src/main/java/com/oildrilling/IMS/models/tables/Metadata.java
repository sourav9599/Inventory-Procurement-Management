package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamoDBTable(tableName = "metadata")
public class Metadata {
    @DynamoDBHashKey
    private String metadataId;
    @DynamoDBAttribute
    private String metadataName;
    @DynamoDBAttribute
    private List<MetadataDetails> metadataDetails;
}
