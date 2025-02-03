package com.example.Job_Scrapper_API;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobOffer{
    @Id
    @GeneratedValue
    private Integer JobOffer;

    private String JobTitle;
    private String Company;
    private String HomeOffice;
    private String Ort;
    @Column(columnDefinition = "TEXT")
    private String Description;
    @Column(columnDefinition = "TEXT")
    private String url;
    private String type;
    private String gehalt;

}