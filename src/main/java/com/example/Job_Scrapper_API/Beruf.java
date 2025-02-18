package com.example.Job_Scrapper_API;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class Beruf {
    public String Jobtitle;
    public Integer dauer;
    public String description;
}
