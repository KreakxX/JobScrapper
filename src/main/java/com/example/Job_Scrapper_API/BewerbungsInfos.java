package com.example.Job_Scrapper_API;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BewerbungsInfos {
    List<String> KeyWordsCompany;
    List<String> KeyWordsMe;
    String name;
    String CompanyName;
    String Branche;
}
