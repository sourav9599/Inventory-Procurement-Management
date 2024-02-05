package com.oildrilling.IMS.utils;

import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.PublishRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SNSUtils {


    @Autowired
    private AmazonSNSClient amazonSNSClient;
    public void sendEmailNotification(String msg, String subject, String groupName) {
        Map<String,String> topicARN = new HashMap<>();
        topicARN.put("Admin", "arn:aws:sns:us-east-1:636714317761:Admin");
        topicARN.put("Finance", "arn:aws:sns:us-east-1:636714317761:Finance");
        topicARN.put("Director", "arn:aws:sns:us-east-1:636714317761:Director");
        topicARN.put("Procurement", "arn:aws:sns:us-east-1:636714317761:Procurement");
        topicARN.put("Location-Incharge", "arn:aws:sns:us-east-1:636714317761:Location-Incharge");
        topicARN.put("RIG-1-DS", "arn:aws:sns:us-east-1:636714317761:RIG-1-DS");
        topicARN.put("Rig-1-Employee", "arn:aws:sns:us-east-1:636714317761:Rig-1-Employee");
        topicARN.put("Stores", "arn:aws:sns:us-east-1:636714317761:Stores");
        PublishRequest publishRequest = new PublishRequest(topicARN.get(groupName),msg,subject);
        amazonSNSClient.publish(publishRequest);
    }

}
