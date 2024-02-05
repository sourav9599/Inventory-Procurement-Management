package com.oildrilling.IMS.manager;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.oildrilling.IMS.dao.SpareDAO;
import com.oildrilling.IMS.dao.SubComponentDAO;
import com.oildrilling.IMS.dao.VendorDAO;
import com.oildrilling.IMS.models.dataclass.Quotation;
import com.oildrilling.IMS.models.tables.Quotations;
import com.oildrilling.IMS.models.tables.Spare;
import com.oildrilling.IMS.models.tables.SubComponent;
import com.oildrilling.IMS.models.tables.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class DocumentGeneratorManager {

    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    private final QuotationManager quotationManager;
    private final VendorDAO vendorDAO;
    private final SubComponentDAO subComponentDAO;
    private final SpareDAO spareDAO;
    @Autowired
    public DocumentGeneratorManager(QuotationManager quotationManager, VendorDAO vendorDAO, SubComponentDAO subComponentDAO, SpareDAO spareDAO) {
        this.quotationManager = quotationManager;
        this.vendorDAO = vendorDAO;
        this.subComponentDAO = subComponentDAO;
        this.spareDAO = spareDAO;
    }

    public ResponseEntity<byte[]> generateWorkOrderDocument(String rigId, String rigName, String componentName, String materialRequestId, String materialType, String materialId, int quantity) {
        Quotations quotations = quotationManager.getQuote(rigId, materialRequestId);
        if(quotations == null ){
            throw new IllegalStateException("Quotation doesn't exist");
        }
        String acceptedQuote = quotations.getAcceptedQuoteId();
        if(acceptedQuote == null){
            throw new IllegalStateException("Please Accept a Quote from Quotation List");
        }
        List<Quotation> filteredQuotationList = quotations.getQuotationList().stream().filter(data -> Objects.equals(data.getId(), acceptedQuote)).toList();
        if(filteredQuotationList.isEmpty()){
            throw new IllegalStateException("Accepted Quote is not available in Quotation List");
        }
        Quotation quotation = filteredQuotationList.get(0);
        Vendor vendor = vendorDAO.getVendorById(quotation.getVendorId());
        String materialName = null;
        String materialSpec = null;
        String materialModel = null;
        if(Objects.equals(materialType, "Equipment"))
        {
            SubComponent subComponent = subComponentDAO.getSubComponentById(materialId);
            materialName = subComponent.getName();
            materialModel = subComponent.getModel();
            materialSpec = subComponent.getSpecification();
        }
        else {
            Spare spare = spareDAO.getSpareById(materialId);
            materialName = spare.getName();
            materialModel = spare.getModel();
            materialSpec = spare.getSpecification();
        }



        String finalHtml = null;
        Context dataContext = createWorkOrderDataContext(quotation, vendor,materialName,materialModel,materialSpec, rigName, componentName, quantity);
        finalHtml = springTemplateEngine.process("template", dataContext);

        try {
            ByteArrayOutputStream pdfOutputStream = htmlToPdf(finalHtml);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Work_Order_"+rigName+"_"+ materialName + ".pdf");
            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentLength(pdfOutputStream.size())
                    .body(pdfOutputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Context createWorkOrderDataContext(Quotation quotation, Vendor vendor, String materialName, String materialModel, String materialSpec, String rigName, String componentName,
                                                int quantity) {
        Context context = new Context();
        DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        Timestamp tms = new Timestamp(quotation.getDeliveryDate());
        Date date = new Date(tms.getTime());

        Map<String, Object> data = new HashMap<>();
        data.put("materialName", materialName);
        data.put("materialModel", materialModel);
        data.put("materialSpec", materialSpec);
        data.put("quotation", quotation);
        data.put("deliveryDate", df.format(date));
        data.put("vendor", vendor);
        data.put("rigName", rigName);
        data.put("componentName", componentName);
        data.put("quantity", quantity);
        data.put("totalPrice", quotation.getPrice() + quotation.getTax());
        context.setVariables(data);
        return context;
    }

    public ByteArrayOutputStream htmlToPdf(String processedHtml) throws Exception {

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {

            PdfWriter pdfwriter = new PdfWriter(byteArrayOutputStream);

            DefaultFontProvider defaultFont = new DefaultFontProvider(false, true, false);

            ConverterProperties converterProperties = new ConverterProperties();

            converterProperties.setFontProvider(defaultFont);

            HtmlConverter.convertToPdf(processedHtml, pdfwriter, converterProperties);

            return byteArrayOutputStream;

//            FileOutputStream fout = new FileOutputStream("/Use/Desktop/Document/employee.pdf");
//
//            byteArrayOutputStream.writeTo(fout);
//            byteArrayOutputStream.close();
//
//            byteArrayOutputStream.flush();
//            fout.close();

        } catch(Exception ex) {
            throw new Exception(ex);
        }

    }

}
