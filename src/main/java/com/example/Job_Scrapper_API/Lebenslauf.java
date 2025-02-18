package com.example.Job_Scrapper_API;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Lebenslauf {

    public String vorname;
    public String nachname;
    public String email;
    public String TelefonNummer;
    public String adresse;
    public String geburtsdatum;
    public String Github;
    public String description;

    public List<String> skills;
    public List<Beruf> Berufserfahrungen;
    public List<String> Sprachen;
    public List<String> Zertifikate;
    public List<Schule> Bildung;
}
