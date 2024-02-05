package com.oildrilling.IMS.dao;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.oildrilling.IMS.models.tables.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ProjectDAO {
    @Autowired
    private DynamoDBMapper dynamoDBMapper;
    public Project save(Project project){
        dynamoDBMapper.save(project);
        return project;
    }

    public Project getProjectById(String projectId){
        return dynamoDBMapper.load(Project.class, projectId);
    }

    public String delete(String projectId) {
        Project project = dynamoDBMapper.load(Project.class, projectId);
        dynamoDBMapper.delete(project);
        return project.getId() + " is deleted";
    }

    public String update(String projectId, Project project){
        dynamoDBMapper.save(project,
                new DynamoDBSaveExpression()
                        .withExpectedEntry("id",
                                new ExpectedAttributeValue(
                                        new AttributeValue().withS(projectId)
                                )
                        )
        );
        return project.getId() + " is updated";
    }
}
