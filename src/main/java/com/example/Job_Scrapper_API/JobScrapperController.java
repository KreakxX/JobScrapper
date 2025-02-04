package com.example.Job_Scrapper_API;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/Job")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobScrapperController {

    private final ScrapperService service;

    @GetMapping("/scrape/Jobs/from/Stepstone/{Jobtitle}/{Ort}")
    public void  scrapeJobsFromStepstone(@PathVariable String Jobtitle, @PathVariable String Ort) throws InterruptedException {
         service.scrappeJobOffersFromStepstone(Jobtitle,Ort);
    }

    @GetMapping("/scrappe/Jobs/from/Indeed/{Jobtitle}/{Ort}")
    public void scrapeJobsFromIndeed(@PathVariable String Jobtitle, @PathVariable String Ort){
         service.scrappeOffersFromIndeed(Jobtitle,Ort);
    }

    @GetMapping("/scrappe/Jobs/from/AgentureFürArbeit/{Jobtitle}/{Ort}")
    public void scrappeJobsFromAgenturFürArbeit(@PathVariable String Jobtitle, @PathVariable String Ort) throws InterruptedException {
        service.scrapeJobsFromAgenturFürArbeit(Jobtitle, Ort);
    }

    @GetMapping("/scrappe/Jobs/from/Xing/{Jobtitle}/{Ort}")
    public void scrappeJobsFromXing(@PathVariable String Jobtitle, @PathVariable String Ort) throws InterruptedException{
        service.scrapeJobsFromXing(Jobtitle, Ort);
    }

    @GetMapping("/get/Job/Offers")
    public List<JobOffer> getAllJobOffers(){
        return service.getAllJobOffers();
    }

    @GetMapping("/get/Job/Offers/{Gehalt}")
    public List<JobOffer> getJobOffersWithGehalt(@PathVariable double Gehalt){
        return service.getJobsWithSpecificSalary(Gehalt);
    }

    @GetMapping("/get/result/count")
    public int getResultCount(){
        return service.getResultCount();
    }

    @GetMapping("/get/jobs/from/plattform/{plattform}")
    public List<JobOffer> getJobsFromPlattform(@PathVariable String plattform){
        return service.getJobsFromSpecificPlattForm(plattform);
    }

    @GetMapping("/sort/JobOffers/based/on/maxed/Salary")
    public List<JobOffer> SortJobOffersBasedOnSalary(){
        return service.SortJobsBasedOnHighestSalary();
    }

    @GetMapping("/sort/JobOffers/based/on/lowest/Salary")
    public List<JobOffer> SortJobsOffersBasedOnLowestSalary(){
        return service.SortJobsBasedOnLowestSalary();
    }
}
