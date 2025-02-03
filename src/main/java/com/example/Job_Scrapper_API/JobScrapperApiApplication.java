package com.example.Job_Scrapper_API;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JobScrapperApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobScrapperApiApplication.class, args);
	}

}
