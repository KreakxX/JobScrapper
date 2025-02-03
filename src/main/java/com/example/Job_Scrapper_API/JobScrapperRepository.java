package com.example.Job_Scrapper_API;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobScrapperRepository extends JpaRepository<JobOffer, Integer> {
}
