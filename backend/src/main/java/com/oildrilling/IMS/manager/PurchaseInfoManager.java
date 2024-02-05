package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.PurchaseInfoDAO;
import com.oildrilling.IMS.models.dataclass.PurchaseInfoData;
import com.oildrilling.IMS.models.tables.PurchaseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseInfoManager {

    private final PurchaseInfoDAO purchaseInfoDAO;
    @Autowired
    public PurchaseInfoManager(PurchaseInfoDAO purchaseInfoDAO) {
        this.purchaseInfoDAO = purchaseInfoDAO;
    }

    public List<PurchaseInfoData> getPurchaseInfoDataListById(String purchaseInfoId, String materialId) {
        PurchaseInfo purchaseInfo =  purchaseInfoDAO.getPurchaseInfoById(materialId);
        Map<String, List<PurchaseInfoData>> purchaseInfoDataMap =  purchaseInfo.getPurchaseInfoDataMap();
        if(purchaseInfoDataMap.containsKey(purchaseInfoId)){
            return purchaseInfoDataMap.get(purchaseInfoId);
        }
        return new ArrayList<>();
    }
}
