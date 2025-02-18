package com.example.Job_Scrapper_API;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class Schule {
    public String Name;
    public String Ort;
    public String Klassen;
    public String Dauer;
}
