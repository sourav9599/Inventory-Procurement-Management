package com.oildrilling.IMS.models.tables;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
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
@DynamoDBTable(tableName = "purchase_info")
public class PurchaseInfo {
    @DynamoDBHashKey
    private String id;
    @DynamoDBAttribute
    private Map<String, List<PurchaseInfoData>> purchaseInfoDataMap;
}
