package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.MetadataDAO;
import com.oildrilling.IMS.models.tables.Metadata;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class MetadataManager {
    private final MetadataDAO metadataDAO;
    @Autowired
    public MetadataManager(MetadataDAO metadataDAO) {
        this.metadataDAO = metadataDAO;
    }

    public Metadata getMetadataByName(String metadataName) {
        List<Metadata> metadataList = metadataDAO.getMetadataByName(metadataName);
        if(metadataList.isEmpty())
        {
            throw new IllegalStateException(metadataName + " doesn't exist in metadata.");
        }
        return metadataList.get(0);
    }


    public Metadata addNewMetadata(String metadataName) {
        List<Metadata> metadataList = metadataDAO.getMetadataByName(metadataName);
        if(metadataList.isEmpty())
        {
            String metadataId = UUID.randomUUID().toString();
            List<MetadataDetails> metadataDetailsList = new ArrayList<>();
            Metadata newMetadata = Metadata.builder().metadataId(metadataId).metadataName(metadataName)
                    .metadataDetails(metadataDetailsList).build();
            return metadataDAO.save(newMetadata);
        }
        else {
            return metadataList.get(0);
        }

    }
    public Metadata updateMetadata(Metadata metadata) {
        return metadataDAO.update(metadata.getMetadataId(), metadata);

    }

    public void updateMetadataDetails(String metadataName, String metadataValue) {

        List<Metadata> metadataList = metadataDAO.getMetadataByName(metadataName);
        if(metadataList.isEmpty())
        {
            throw new IllegalStateException(metadataName + " doesn't exist in metadata.");
        }
        else {

            Metadata metadata = metadataList.get(0);
            List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
            List<MetadataDetails> filteredmetadataDetailsList = metadataDetailsList.stream().filter(data -> Objects.equals(data.getName(), metadataValue)).toList();
            if(filteredmetadataDetailsList.isEmpty())
            {
                String metadataValueId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                metadataDetailsList.add(MetadataDetails.builder().id(metadataValueId).name(metadataValue).build());
                metadata.setMetadataDetails(metadataDetailsList);
                metadataDAO.update(metadata.getMetadataId(), metadata);
            }

        }

    }
}
