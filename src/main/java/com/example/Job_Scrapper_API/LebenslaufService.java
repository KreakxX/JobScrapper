package com.example.Job_Scrapper_API;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.List;
import com.itextpdf.layout.element.ListItem;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import com.itextpdf.layout.Document;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class LebenslaufService {


    public void generatePerfectLebenslauf(Lebenslauf lebenslauf, String FilePath) throws IOException {
        File file = new File(FilePath);

        PdfWriter writer = new PdfWriter("C:/Users/Henri/Downloads/" + FilePath);
        PdfDocument PDFdocument = new PdfDocument(writer);
        Document document = new Document(PDFdocument);
        document.setBold();
        document.setFontSize(18);
        document.add(new Paragraph("Lebenslauf"));

        document.setFontSize(12);
        document.setBold();
        document.add(new Paragraph("Email: " + lebenslauf.getEmail()).setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("Telefon: " + lebenslauf.getTelefonNummer()).setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("Adresse: " + lebenslauf.getAdresse()).setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("Geburtsdatum: " + lebenslauf.getGeburtsdatum()).setTextAlignment(TextAlignment.RIGHT));

        document.add(new Paragraph("GitHub: " + lebenslauf.getGithub()).setTextAlignment(TextAlignment.RIGHT));
        document.add(new Paragraph("\n"));
        document.setFontSize(18);
        document.setBold();
        document.add(new Paragraph(lebenslauf.getVorname()+ " " + lebenslauf.getNachname()));
        document.setBold();

        document.setFontSize(12);
        document.add(new Paragraph(lebenslauf.getDescription()));
        document.add(new Paragraph("\n"));

        document.setBold();
        document.setFontSize(17);
        document.add(new Paragraph("Skills:"));
        List skillList = new List();
        for(String skill: lebenslauf.getSkills()){
            skillList.add(new ListItem(skill));
        }
        document.setFontSize(12);
        document.add(skillList);
        document.add(new Paragraph("\n"));


        if (lebenslauf.getBerufserfahrungen() != null && !lebenslauf.getBerufserfahrungen().isEmpty()) {
            document.setBold();
            document.setFontSize(17);
            document.add(new Paragraph("Berufserfahrungen:"));
            for (Beruf erfahrung : lebenslauf.getBerufserfahrungen()) {
                document.setFontSize(14);
                document.add(new Paragraph(erfahrung.getJobtitle()));
                document.setFontSize(12);
                document.add(new Paragraph("Dauer: " + erfahrung.dauer +" Jahre gearbeitet"));
                document.add(new Paragraph("Tätigkeit: " +erfahrung.description));
                document.add(new Paragraph("\n"));
            }
        }

        if (lebenslauf.getZertifikate() != null && !lebenslauf.getZertifikate().isEmpty()) {
            document.setBold();
            document.setFontSize(17);
            document.add(new Paragraph("Zertifikate:"));
            document.setFontSize(12);
            List zertifikatList = new List();
            for (String zertifikat : lebenslauf.getZertifikate()) {
                zertifikatList.add(new ListItem(zertifikat));
            }
            document.add(zertifikatList);
            document.add(new Paragraph("\n"));
        }

        // Sprachen
        if (lebenslauf.getSprachen() != null && !lebenslauf.getSprachen().isEmpty()) {
            document.setBold();
            document.setFontSize(17);
            document.add(new Paragraph("Sprachen:"));
            document.setFontSize(12);

            document.add(new Paragraph(String.join(", ", lebenslauf.getSprachen())));
            document.add(new Paragraph("\n"));
        }

        if(lebenslauf.getBildung() != null && !lebenslauf.getBildung().isEmpty()){
            document.setBold();
            document.setFontSize(17);
            document.add(new Paragraph("Bildung:"));
            for (Schule schule : lebenslauf.getBildung()) {
                document.setFontSize(14);
                document.add(new Paragraph(schule.getName()));
                document.setFontSize(12);
                document.add(new Paragraph("Klasse: "+ schule.getKlassen()));
                document.add(new Paragraph("Ort: " +schule.Ort));
                document.add(new Paragraph("\n"));
            }
        }

        document.close();
    }
    /*
    @Scheduled(fixedRate = 36000)
    public void test(){
        Lebenslauf lebenslauf = Lebenslauf.builder()
                .vorname("Max")
                .nachname("Mustermann")
                .email("max.mustermann@example.com")
                .TelefonNummer("+49 123 456789")
                .adresse("Musterstraße 12, 12345 Musterstadt")
                .Github("github.com/maxmustermann")
                .description("Erfahrener Softwareentwickler mit Schwerpunkt auf Java und Spring Boot.")
                .skills(java.util.List.of("Java", "Spring Boot", "React", "Docker", "AWS"))
                .Berufserfahrungen(java.util.List.of(
                        new Beruf("OpenAI", "Software Engineer", 2, "Entwicklung von KI-Modellen."),
                        new Beruf("Google", "Backend Developer", 1, "Entwicklung skalierbarer Microservices.")
                ))
                .Zertifikate(java.util.List.of("AWS Certified Developer", "Oracle Java SE 11 Programmer"))
                .Sprachen(java.util.List.of("Deutsch", "Englisch", "Französisch"))
                .Bildung(java.util.List.of(new Schule("Grundschule am Fuchsberg", "Biesdorf", "1-6","6"), new Schule("Wilhelm von Siemens Gymansium", "Marzahn", "7-12","5")))
                .build();

        // PDF generieren
        try {
            generatePerfectLebenslauf(lebenslauf, "lebenslauf.pdf");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
    */

}
