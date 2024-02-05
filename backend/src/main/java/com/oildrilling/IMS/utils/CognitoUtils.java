package com.oildrilling.IMS.utils;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.ListUsersInGroupRequest;
import com.amazonaws.services.cognitoidp.model.ListUsersInGroupResult;
import com.amazonaws.services.cognitoidp.model.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CognitoUtils {
    @Autowired
    private AWSCognitoIdentityProvider cognitoIdentityProvider;

    public List<String> getEmailsInGroup(String groupName){
        ListUsersInGroupRequest listUsersRequest = new ListUsersInGroupRequest()
                .withGroupName(groupName)
                .withUserPoolId("us-east-1_gnc2CwFig");

        ListUsersInGroupResult listUsersResponse = cognitoIdentityProvider.listUsersInGroup(listUsersRequest);
        List<UserType> users = listUsersResponse.getUsers();
        List<String> emailList = new ArrayList<>();
        for (UserType user : users) {
            for (AttributeType attribute : user.getAttributes()) {
                if ("email".equals(attribute.getName())) {
                    emailList.add(attribute.getValue());
                    break;
                }
            }

        }
        return emailList;

    }



}
