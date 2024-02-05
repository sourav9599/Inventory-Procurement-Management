package com.oildrilling.IMS.manager;

import com.oildrilling.IMS.dao.ManufacturerDAO;
import com.oildrilling.IMS.models.dataclass.MetadataDetails;
import com.oildrilling.IMS.models.tables.Manufacturer;
import com.oildrilling.IMS.models.tables.Metadata;
import com.oildrilling.IMS.models.tables.Spare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ManufacturerManager {
    private final ManufacturerDAO manufacturerDAO;
    private final MetadataManager metadataManager;
    @Autowired
    public ManufacturerManager(ManufacturerDAO manufacturerDAO, MetadataManager metadataManager) {
        this.manufacturerDAO = manufacturerDAO;
        this.metadataManager = metadataManager;
    }
    private String rephrase(String value) {
        if(value.isEmpty())
        {
            throw new IllegalStateException(value + " cannot be empty..");
        }
        return value.substring(0, 1).toUpperCase() + value.substring(1);
    }
    public Manufacturer getManufacturer(String manufacturerId) {
        return manufacturerDAO.getManufacturerById(manufacturerId);
    }
    public void addNewManufacturer(Manufacturer manufacturer) {
        String manufacturerName = rephrase(manufacturer.getName());
        String country = rephrase(manufacturer.getCountryOfOrigin());
        Metadata metadata = metadataManager.getMetadataByName("manufacturer");
        List<MetadataDetails> filteredMetadataDetailsList = metadata.getMetadataDetails().stream().filter(data -> Objects.equals(data.getName(), manufacturerName)).toList();
        if(!filteredMetadataDetailsList.isEmpty())
        {
            throw new IllegalStateException("Manufacturer Name: "+ manufacturerName + " already exists. Please try with a different Manufacturer Name.");
        }
        String manufacturerId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        manufacturer.setId(manufacturerId);
        manufacturer.setName(manufacturerName);
        manufacturer.setCountryOfOrigin(country);
        Manufacturer newManufacturer = manufacturerDAO.save(manufacturer);

        List<MetadataDetails> metadataDetailsList = metadata.getMetadataDetails();
        metadataDetailsList.add(MetadataDetails.builder().id(newManufacturer.getId()).name(newManufacturer.getName()).build());
        metadata.setMetadataDetails(metadataDetailsList);
        metadataManager.updateMetadata(metadata);
    }
}
