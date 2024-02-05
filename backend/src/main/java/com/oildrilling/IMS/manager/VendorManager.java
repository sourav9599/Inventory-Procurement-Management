package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.PurchaseInfoDAO;
import com.oildrilling.IMS.dao.VendorDAO;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import com.oildrilling.IMS.models.tables.Metadata;
import com.oildrilling.IMS.models.tables.PurchaseInfo;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VendorManager {

    private final VendorDAO vendorDAO;
    private final MetadataManager metadataManager;
    private final PurchaseInfoDAO purchaseInfoDAO;
    @Autowired
    public VendorManager(VendorDAO vendorDAO, MetadataManager metadataManager, PurchaseInfoDAO purchaseInfoDAO) {
        this.vendorDAO = vendorDAO;
        this.metadataManager = metadataManager;
        this.purchaseInfoDAO = purchaseInfoDAO;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }

    public void addNewVendor(Vendor vendor) {
        String vendorName = rephrase(vendor.getName());
        Metadata metadata = metadataManager.getMetadataByName("vendor");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), vendorName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Vendor Name: "+ vendorName + " already exists. Please try with a different Vendor Name.");
        }
        String vendorId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        vendor.setId(vendorId);
        vendor.setName(vendorName);
        Vendor newVendor = vendorDAO.save(vendor);
        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newVendor.getId()).name(newVendor.getName()).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);
    }

    public List<MetadataDetails> getRecommendedVendors(String materialId, String purchaseInfoId) {
        Metadata metadata = metadataManager.getMetadataByName("vendor");
        PurchaseInfo purchaseInfo = purchaseInfoDAO.getPurchaseInfoById(materialId);
        if(purchaseInfo == null){
            return metadata.getMetadataDetails();
        }
        Map<String, List<PurchaseInfoData>> purchaseInfoDataMap =  purchaseInfo.getPurchaseInfoDataMap();
        if(purchaseInfoDataMap.containsKey(purchaseInfoId)){
            List<PurchaseInfoData> purchaseInfoDataList = purchaseInfoDataMap.get(purchaseInfoId);
            Set<MetadataDetails> metadataDetailsSet = new LinkedHashSet<>();
            for(PurchaseInfoData purchaseInfoData : purchaseInfoDataList){
                metadataDetailsSet.add(MetadataDetails.builder().id(purchaseInfoData.getVendorId()).name(purchaseInfoData.getVendorName()).build());
            }
            metadataDetailsSet.addAll(metadata.getMetadataDetails());
            return new ArrayList<>(metadataDetailsSet);
        }
        else {
            return metadata.getMetadataDetails();
        }

    }
}
