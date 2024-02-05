package com.oildrilling.IMS.manager;

import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.PublishRequest;
import com.oildrilling.IMS.dao.*;
import com.oildrilling.IMS.models.data.SubComponentMetadata;
import com.oildrilling.IMS.models.dataclass.*;
import com.oildrilling.IMS.models.tables.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SpareManager {
    private final SpareDAO spareDAO;
    private final RigDAO rigDAO;
    private final ComponentDAO componentDAO;
    private final SubComponentDAO subComponentDAO;
    private final PurchaseInfoDAO purchaseInfoDAO;
    private final LogsDAO logsDAO;
    private final MetadataManager metadataManager;
    private final MaterialRequestManager materialRequestManager;
    @Autowired
    private AmazonSNSClient amazonSNSClient;

    @Autowired
    public SpareManager(SpareDAO spareDAO, RigDAO rigDAO, ComponentDAO componentDAO, SubComponentDAO subComponentDAO, PurchaseInfoDAO purchaseInfoDAO, LogsDAO logsDAO, MetadataManager metadataManager, MaterialRequestManager materialRequestManager) {
        this.spareDAO = spareDAO;
        this.rigDAO = rigDAO;
        this.componentDAO = componentDAO;
        this.subComponentDAO = subComponentDAO;
        this.purchaseInfoDAO = purchaseInfoDAO;
        this.logsDAO = logsDAO;
        this.metadataManager = metadataManager;
        this.materialRequestManager = materialRequestManager;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
    public Spare removeSpareQuantity(String rigId, String componentId, String subComponentId, String spareId, int quantity, String comment, String user){
        Rig rig = rigDAO.getRigById(rigId);
        Component component = componentDAO.getComponentById(componentId);
        SubComponent subComponent = subComponentDAO.getSubComponentById(subComponentId);
        Spare spare = spareDAO.getSpareById(spareId);
        String ID = rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId() +"_"+ spare.getId();
        Logs logs = logsDAO.getLogsById(ID);


        Map<String, Integer> totalQuantityMap = spare.getTotalQuantity();
        if(totalQuantityMap.containsKey(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId())){
            Integer availableQuantity = totalQuantityMap.get(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId());
            int updatedQuantity = availableQuantity - quantity;
            if(updatedQuantity < 0){
                throw new IllegalStateException("Remove Quantity is more than available quantity. Quantity Available: " + availableQuantity);
            }
            totalQuantityMap.put(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId(), updatedQuantity);
            if(updatedQuantity <= spare.getReorderPoint())
            {
                String subject = "Reorder Point Reached for Spare: " + spare.getName();
                sendEmailNotification(spare.toString(), subject);
                String materialRequestId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                MaterialRequest materialRequest = MaterialRequest.builder()
                        .materialRequestId(materialRequestId)
                        .user("System")
                        .rigId(rigId)
                        .rigName(rig.getRigName())
                        .componentId(componentId)
                        .componentName(component.getName())
                        .subComponentId(subComponentId)
                        .subComponentName(subComponent.getName())
                        .materialId(spare.getId())
                        .materialName(spare.getName())
                        .quantity(spare.getReorderPoint())
                        .comments(List.of(CommentData.builder().user("System").group("System").timestamp(System.currentTimeMillis()).message("Auto MR Generated. \n\nReorder Point Reached for Spare: " + spare.getName()).build()))
                        .createdDate(System.currentTimeMillis())
                        .materialType("Spare")
                        .currentStatus("Pending Approval")
                        .pendingApprovalGroup("Location-Incharge")
                        .build();
                materialRequestManager.createMR(materialRequest);
            }

        }
        else {
            throw new IllegalStateException("Spare doesn't exist for the Rig");
        }
        spare.setTotalQuantity(totalQuantityMap);
        spareDAO.update(spare.getId(), spare);

        String logsDataId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        if(logs == null){
            logsDAO.save(Logs.builder().id(ID).logsDataList(new ArrayList<>(List.of(
                    LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Remove").quantity(quantity).logMessage(
                            "Removed "+ quantity +" quantity of "+ spare.getName() +" from "+ subComponent.getName() +" in Component "
                                    +component.getName()+" at Rig " + rig.getRigName() + ". Comments: " + comment
                    ).build()))).build());
        }
        else {
            List<LogsData> logsDataList = logs.getLogsDataList();
            logsDataList.add(LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Remove").quantity(quantity).logMessage(
                    "Removed "+ quantity +" quantity of "+ spare.getName() +" from "+ subComponent.getName() +" in Component "
                            +component.getName()+" at Rig " + rig.getRigName()  + ". Comments: " + comment
            ).build());
            logs.setLogsDataList(logsDataList);
            logsDAO.update(logs.getId(), logs);
        }
        return spare;
    }

    private void sendEmailNotification(String msg, String subject) {
        String topicARN = "arn:aws:sns:us-east-1:636714317761:threshold-alert";
        PublishRequest publishRequest = new PublishRequest(topicARN,msg,subject);
        amazonSNSClient.publish(publishRequest);
    }

    public Spare addSpareQuantity(String rigId, String componentId, String subComponentId, String spareId, int quantity, String user){
        Rig rig = rigDAO.getRigById(rigId);
        Component component = componentDAO.getComponentById(componentId);
        SubComponent subComponent = subComponentDAO.getSubComponentById(subComponentId);
        Spare spare = spareDAO.getSpareById(spareId);
        String ID = rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId() +"_"+ spare.getId();
        Logs logs = logsDAO.getLogsById(ID);

        Map<String, Integer> totalQuantityMap = spare.getTotalQuantity();
        if(totalQuantityMap.containsKey(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId())){
            Integer availableQuantity = totalQuantityMap.get(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId());
            totalQuantityMap.put(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId(), availableQuantity + quantity);
        }
        else {
            totalQuantityMap.put(rig.getRigId() +"_"+ component.getId() +"_"+ subComponent.getId(), quantity);
        }

        spare.setTotalQuantity(totalQuantityMap);
        Spare updatedSpare = spareDAO.update(spare.getId(), spare);

        Map<String, List<MetadataDetails>> subComponentSpareMap = subComponent.getSpareMap();
        if(subComponentSpareMap.containsKey(rig.getRigId() + "_" + component.getId())){
            List<MetadataDetails> spareList = subComponentSpareMap.get(rig.getRigId() + "_" + component.getId());
            List<MetadataDetails> filteredSpareList = spareList.stream().filter(data -> Objects.equals(data.getId(), spare.getId())).toList();
            if(filteredSpareList.isEmpty()){
                spareList.add(MetadataDetails.builder().id(spare.getId()).name(spare.getName()).build());
                subComponentSpareMap.put(rig.getRigId() + "_" + component.getId(), spareList);
            }
        }
        else {
            subComponentSpareMap.put(rig.getRigId() + "_" + component.getId(), Collections.singletonList(MetadataDetails.builder().id(spare.getId()).name(spare.getName()).build()));
        }

        Map<String, SubComponentMetadata> subComponentMetadataMap = subComponent.getSubComponentData();
        if(!subComponentMetadataMap.containsKey(rig.getRigId() +"_"+ component.getId())){
            subComponentMetadataMap.put(rig.getRigId() +"_"+ component.getId(), SubComponentMetadata.builder().totalQuantity(1).worksRequired("").detailsOfTesting("").build());
        }
        subComponent.setSubComponentData(subComponentMetadataMap);
        subComponent.setSpareMap(subComponentSpareMap);
        subComponentDAO.update(subComponent.getId(), subComponent);



        Map<String, List<MetadataDetails>> componentSubComponentMap = component.getSubComponentMap();
        if(componentSubComponentMap.containsKey(rig.getRigId())){
            List<MetadataDetails> subComponentList = componentSubComponentMap.get(rig.getRigId());
            List<MetadataDetails> filteredSubComponentList = subComponentList.stream().filter(data -> Objects.equals(data.getId(), subComponent.getId())).toList();
            if(filteredSubComponentList.isEmpty()){
                subComponentList.add(MetadataDetails.builder().id(subComponent.getId()).name(subComponent.getName()).build());
                componentSubComponentMap.put(rig.getRigId(), subComponentList);
            }
        }
        else {
            componentSubComponentMap.put(rig.getRigId(), Collections.singletonList(MetadataDetails.builder().id(subComponent.getId()).name(subComponent.getName()).build()));
        }
        component.setSubComponentMap(componentSubComponentMap);
        componentDAO.update(component.getId(), component);

        List<MetadataDetails> componentList = rig.getComponentList();
        List<MetadataDetails> filteredComponentList = componentList.stream().filter(data -> Objects.equals(data.getId(), component.getId())).toList();
        if(filteredComponentList.isEmpty()){
            componentList.add(MetadataDetails.builder().id(component.getId()).name(component.getName()).build());
            rig.setComponentList(componentList);
            rigDAO.update(rig.getRigId(), rig);
        }



        String logsDataId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        if(logs == null){
            logsDAO.save(Logs.builder().id(ID).logsDataList(new ArrayList<>(List.of(
                    LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Add").quantity(quantity).logMessage(
                            "Added "+ quantity +" quantity of "+ spare.getName() +" to "+ subComponent.getName() +" in Component "
                                    +component.getName()+" at Rig " + rig.getRigName()
                    ).build()))).build());
        }
        else {
            List<LogsData> logsDataList = logs.getLogsDataList();
            logsDataList.add(LogsData.builder().id(logsDataId).timestamp(System.currentTimeMillis()).user(user).actionType("Add").quantity(quantity).logMessage(
                    "Added "+ quantity +" quantity of "+ spare.getName() +" to "+ subComponent.getName() +" in Component "
                            +component.getName()+" at Rig " + rig.getRigName()
            ).build());
            logs.setLogsDataList(logsDataList);
            logsDAO.update(logs.getId(), logs);
        }

        return updatedSpare;


    }

    public void addNewSpare(Spare spare) {
        String newSpareName = rephrase(spare.getName());
        String model = rephrase(spare.getModel());
        String spec = spare.getSpecification();
        Metadata metadata = metadataManager.getMetadataByName("spare");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), newSpareName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Spare Name: "+ newSpareName + " already exists. Please try with a different Spare Name.");
        }
        String spareId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        spare.setId(spareId);
        spare.setName(newSpareName);
        spare.setModel(model);
        spare.setTotalQuantity(new HashMap<>());
        Spare newSpare = spareDAO.save(spare);

        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newSpare.getId()).name(newSpare.getName()+"-"+ spec).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);

    }

    public Spare getSpareById(String spareId) {
        return spareDAO.getSpareById(spareId);
    }

    public List<Map<String, Object>> getSpareList(List<MetadataDetails> spareDetails, String rigId, String componentId, String subComponentId) {
        List<Map<String, Object>> spareList = new ArrayList<>();
        for(MetadataDetails spareData: spareDetails){
            Spare spare = spareDAO.getSpareById(spareData.getId());
            if(spare.getTotalQuantity().containsKey(rigId + "_" + componentId +"_" + subComponentId)){
                Map<String, Object> spareMap = new HashMap<>();
                int quantity = spare.getTotalQuantity().get(rigId + "_" + componentId +"_" + subComponentId);
                spareMap.put("id", spare.getId());
                spareMap.put("name", spare.getName());
                spareMap.put("description", spare.getDescription());
                spareMap.put("specification", spare.getSpecification());
                spareMap.put("model", spare.getModel());
                spareMap.put("reorderPoint", spare.getReorderPoint());
                spareMap.put("quantity", quantity);
                spareMap.put("usageType", spare.getUsageType());
                spareMap.put("category", spare.getCategory());
                spareList.add(spareMap);
            }
        }
        return spareList;
    }

    public void updateSpare(Spare reqSpare) {
        Spare spare = spareDAO.getSpareById(reqSpare.getId());
        spare.setName(reqSpare.getName());
        spare.setDescription(reqSpare.getDescription());
        spare.setSpecification(reqSpare.getSpecification());
        spare.setModel(reqSpare.getModel());
        spare.setReorderPoint(reqSpare.getReorderPoint());
        spare.setCategory(reqSpare.getCategory());
        spare.setUsageType(reqSpare.getUsageType());
        spareDAO.update(spare.getId(), spare);
    }
}
