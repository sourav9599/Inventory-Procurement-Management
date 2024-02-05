package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.dataclass.ComponentData;
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
@DynamoDBTable(tableName = "rig")
public class Rig {
    @DynamoDBHashKey
    private String rigId;
    @DynamoDBAttribute
    private String rigName;
    @DynamoDBAttribute
    private String location;
    @DynamoDBAttribute
    private long dateOfInception;
    @DynamoDBAttribute
    private List<MetadataDetails> componentList;
}
