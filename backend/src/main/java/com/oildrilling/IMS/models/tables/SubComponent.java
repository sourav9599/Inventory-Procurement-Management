package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.data.SubComponentMetadata;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamoDBTable(tableName = "subcomponent")
public class SubComponent {
    @DynamoDBHashKey
    private String id;
    @DynamoDBAttribute
    private String name;
    @DynamoDBAttribute
    private String description;
    @DynamoDBAttribute
    private String model;
    @DynamoDBAttribute
    private String specification;
    @DynamoDBAttribute
    private int reorderPoint;
    @DynamoDBAttribute
    private Map<String, SubComponentMetadata> subComponentData;
    @DynamoDBAttribute
    private Map<String, List<MetadataDetails>> spareMap;
}
