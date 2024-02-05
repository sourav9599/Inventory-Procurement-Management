package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.dataclass.CommentData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@DynamoDBTable(tableName = "MaterialRequest")
public class MaterialRequest {
    @DynamoDBHashKey
    private String materialRequestId;
    @DynamoDBAttribute
    private String user;
    @DynamoDBAttribute
    private String materialName;
    @DynamoDBAttribute
    private String materialId;
    @DynamoDBAttribute
    private String rigId;
    @DynamoDBAttribute
    private String rigName;
    @DynamoDBAttribute
    private String componentId;
    @DynamoDBAttribute
    private String componentName;
    @DynamoDBAttribute
    private String subComponentId;
    @DynamoDBAttribute
    private String subComponentName;
    @DynamoDBAttribute
    private String projectId;
    @DynamoDBAttribute
    private String projectName;
    @DynamoDBRangeKey
    private long createdDate;
    @DynamoDBAttribute
    private String materialType;
    @DynamoDBAttribute
    private int quantity;
    @DynamoDBAttribute
    private long deadline;
    @DynamoDBAttribute
    private String manufacturerId;
    @DynamoDBAttribute
    private String manufacturerName;
    @DynamoDBAttribute
    private String currentStatus;
    @DynamoDBAttribute
    private String pendingApprovalGroup;
    @DynamoDBAttribute
    private List<CommentData> comments;
}
