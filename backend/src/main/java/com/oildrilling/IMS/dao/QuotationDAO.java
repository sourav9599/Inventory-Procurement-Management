package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.PaginatedScanList;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.*;
import com.oildrilling.IMS.models.tables.Quotations;
import com.oildrilling.IMS.models.tables.Rig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class QuotationDAO {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public void addQuote(Quotations quotations) {
        dynamoDBMapper.save(quotations);
    }

    public Quotations getQuote(String id) {
        return dynamoDBMapper.load(Quotations.class, id);
    }

}
