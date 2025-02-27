package com.example.Job_Scrapper_API;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ScrapperService {

    private final JobScrapperRepository repository;
    private final RestTemplate restTemplate;


    public void scrappeJobOffersFromStepstone(String JobTitle, String Ort) {
        for (JobOffer offer : repository.findAll()) {
            if (offer.getType().equals("Stepstone")) {
                repository.delete(offer);
            }
        }
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-component-update");
        options.addArguments("--enable-default-apps");
        options.addArguments("--enable-extensions");
        List<JobOffer> jobOffers = new ArrayList<>();
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Henri\\Videos\\Java\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(options);
        String url1 = "https://www.stepstone.de/jobs/" + JobTitle + "/in-" + Ort + "?radius=30&page=" + 0;
        driver.get(url1);
        String MaxPage = driver.findElement(By.cssSelector("[aria-label*='von ']"))
                .getAttribute("aria-label")
                .split("von ")[1];
        System.out.println(MaxPage);
        int maxPage = Integer.parseInt(MaxPage);
        WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement cookieBanner = wait2.until(ExpectedConditions.visibilityOfElementLocated(By.id("ccmgt_explicit_accept")));
        cookieBanner.click();

        String loginUrl = driver.findElement(By.cssSelector(".hf-provider-1chzj96")).getAttribute("href");
        System.out.println(loginUrl);
        driver.get("https://www.stepstone.de/de-DE/candidate/login?login_source=Resultlist_top-login&intcid=Button_Resultlist-navigation_login&gfp=1");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        WebElement EmailInput = driver.findElement(By.cssSelector(".gp-1n5gqlu"));
        EmailInput.sendKeys("Henrik.standke@web.de");
        WebElement PassWordInput = driver.findElement(By.cssSelector(".gp-1v58bed"));
        PassWordInput.sendKeys("Henrik2008");
        WebElement loginButton = driver.findElement(By.cssSelector(".gp-1c37dok"));
        loginButton.click();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.get(url1);
        driver.navigate().refresh();
        for (int i = 0; i < maxPage; i++) {
            String url2 = "https://www.stepstone.de/jobs/" + JobTitle + "/in-" + Ort + "?radius=30&page=" + i;
            driver.get(url2);
            List<WebElement> ListedJobs = driver.findElements(By.cssSelector(".res-sfoyn7"));
            if (ListedJobs.isEmpty()) {
                System.out.println("Empty");
            }
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(4));
            try {
                WebElement cookieBanner2 = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("ccmgt_explicit_accept")));
                cookieBanner2.click();
            } catch (TimeoutException e) {
                System.out.println("Cookie-Banner nicht gefunden, fahre fort.");
            }
            for (WebElement job : ListedJobs) {
                String Jobtitle = job.findElement(By.cssSelector(".res-nehv70")).getText();
                String Company = job.findElement(By.cssSelector(".res-1c5ai0d")).getText();
                String HomeOffice = job.findElement(By.cssSelector(".res-lgmafx")).getText();
                if (HomeOffice.contains("€")) {
                    HomeOffice = "Not Specified";
                }
                List<WebElement> elements = job.findElements(By.cssSelector("span[data-genesis-element='TEXT']"));
                String gehalt = "Kein Gehalt gefunden";
                for (WebElement element : elements) {
                    String text = element.getText();
                    if (text.matches(".*\\d+.*") && text.contains("€")) {
                        gehalt = text;
                        break;
                    }
                }
                /*
                List<WebElement> elements1 = job.findElements(By.cssSelector(".res-1fad2gj"));
                for(WebElement element : elements1){
                    String text1 = element.getText();
                    if (text1.matches(".*\\d+.*") && text1.contains("€")) {
                        System.out.println(text1+ "Test");
                        break;
                    }
                }

                 */
                System.out.println(gehalt);
                String url = job.findElement(By.cssSelector("a.res-1foik6i")).getAttribute("href");
                String description = "";
                try {
                    List<WebElement> expandButtons = job.findElements(By.cssSelector(".text-snippet-expand-button"));
                    if (!expandButtons.isEmpty()) {
                        WebElement expandButton = expandButtons.get(0);
                        if (expandButton.isDisplayed()) {
                            expandButton.click();
                            description = job.findElement(By.cssSelector(".res-zb22na")).getText();
                        }
                    } else {
                        description = job.findElement(By.cssSelector(".res-1d1eotm")).getText();
                    }
                } catch (NoSuchElementException e) {
                    System.out.println("Expand button not found or not interactable. Skipping...");
                }
                if (HomeOffice.equals("Gehalt anzeigen")) {
                    HomeOffice = "Not specified";
                }
            /*
            System.out.println(Jobtitle);
            System.out.println(Company);
            System.out.println(HomeOffice);
            System.out.println(Ort);
            System.out.println(description);
            System.out.println("------------------------");
            */

                JobOffer offer = JobOffer.builder()
                        .JobTitle(Jobtitle)
                        .Company(Company)
                        .HomeOffice(HomeOffice)
                        .Ort(Ort)
                        .type("Stepstone")
                        .url(url)
                        .gehalt(gehalt)
                        .Description(description)
                        .build();
                jobOffers.add(offer);
            }
        }
        repository.saveAll(jobOffers);
        driver.quit();
    }


    public void scrappeOffersFromIndeed(String JobTitle, String Ort)  {

        List<JobOffer> jobOffers = new ArrayList<>();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-component-update");
        options.addArguments("--enable-default-apps");
        options.addArguments("--enable-extensions");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("start-maximized");
        options.addArguments("disable-infobars");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Henri\\Videos\\Java\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(options);
        String url = "https://de.indeed.com/jobs?q="+JobTitle+"&l="+Ort+"&from=searchOnHP%2Cwhatautocomplete&vjk=fdefd22fb2e8f0a9";
        driver.get(url);
        try{
            WebElement checkbox = driver.findElement(By.cssSelector("input[type='checkbox']"));
            if(checkbox.isDisplayed()){
                if (!checkbox.isSelected()) {
                    checkbox.click();
                }
            }
        }catch(Exception e){
            e.printStackTrace();
        }


        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".cardOutline.tapItem.dd-privacy-allow.result")));
        List<WebElement> jobElements = driver.findElements(By.cssSelector(".cardOutline.tapItem.dd-privacy-allow.result"));
        if (jobElements.isEmpty()) {
            System.out.println("Keine Jobangebote gefunden.");
        }

        for (WebElement element : jobElements) {
            String jobTitle = element.findElement(By.cssSelector("h2.jobTitle span")).getText();
            String company = element.findElement(By.cssSelector("span[data-testid='company-name']")).getText();
            String jobUrl = element.findElement(By.cssSelector("a[data-jk]")).getAttribute("href");
            String jobSnippet = element.findElement(By.cssSelector("[data-testid='jobsnippet_footer']")).getText();
            JobOffer offer = JobOffer.builder()
                    .JobTitle(jobTitle)
                    .Company(company)
                    .HomeOffice("Nicht Klar")
                    .Ort(Ort)
                    .type("Indeed")
                    .url(jobUrl)
                    .gehalt("Kein Gehalt gefunden")
                    .Description(jobSnippet)
                    .build();
            jobOffers.add(offer);
        }
        repository.saveAll(jobOffers);
        driver.quit();
    }


    public void scrapeJobsFromAgenturFürArbeit(String JobTitle, String Ort) throws InterruptedException {
        for(JobOffer offer : repository.findAll()){
            if(offer.getType().equals("Agentur Für Arbeit")){
                repository.delete(offer);
            }
        }
        List<JobOffer> jobOffers = new ArrayList<>();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-component-update");
        options.addArguments("--enable-default-apps");
        options.addArguments("--enable-extensions");

        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Henri\\Videos\\Java\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(options);
        String url = "https://www.arbeitsagentur.de/jobsuche/suche?angebotsart=1&was="+JobTitle+"&wo="+Ort+"&umkreis=25";
        driver.get(url);
        Thread.sleep(2000);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.cookie = 'cookie_consent=accepted; path=/;';");
        Thread.sleep(1000);
        driver.navigate().refresh();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(6));
        try {
            WebElement cookieButton = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[data-testid='bahf-cookie-disclaimer-btn-alle']")));
            cookieButton.click();

            wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector("bahf-cookie-disclaimer-dpl3")));
            js.executeScript("let cookieBanner = document.querySelector('bahf-cookie-disclaimer-dpl3'); if (cookieBanner) { cookieBanner.remove(); }");
        } catch (TimeoutException e) {
            System.out.println("Cookie banner not found, proceeding...");
        }
        List<WebElement> processedJobs = new ArrayList<>();
            int count = 1;
            boolean moreJobsAvailable = true;
            while (moreJobsAvailable) {
                List<WebElement> elements = driver.findElements(By.cssSelector("ul#ergebnisliste-liste-"+count+" > li"));
                System.out.println("HERE AGAIN");
                for (WebElement job : elements) {
                    if (processedJobs.contains(job)) {
                        continue;
                    }

                    processedJobs.add(job);
                    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", job);

                    String jobTitle = job.findElement(By.cssSelector("span[_ngcontent-ng-c1426178981]")).getText();
                    String company = job.findElement(By.cssSelector(".mitte-links-arbeitgeber")).getText();
                    String jobUrl = job.findElement(By.cssSelector("a[_ngcontent-ng-c1426178981]")).getAttribute("href");

                    job.findElement(By.cssSelector("a[_ngcontent-ng-c1426178981]")).click();

                    String description = "Keine Beschreibung gefunden";
                    WebDriverWait wait3 = new WebDriverWait(driver, Duration.ofSeconds(2));
                    try {
                        WebElement element = wait3.until(ExpectedConditions.visibilityOfElementLocated(By.id("detail-beschreibung-beschreibung")));
                        description = element.getText();
                    } catch (TimeoutException e) {
                        System.out.println("Keine Beschreibung");
                    }

                    WebElement closeModal = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".ba-modal-close")));
                    closeModal.click();
                    Thread.sleep(3500);

                    JobOffer offer = JobOffer.builder()
                            .JobTitle(jobTitle)
                            .Company(company)
                            .url(jobUrl)
                            .Ort(Ort)
                            .Description(description)
                            .gehalt("Kein Gehalt gefunden")
                            .HomeOffice("Not specified")
                            .type("Agentur Für Arbeit")
                            .build();
                    jobOffers.add(offer);
                }

                ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
                Thread.sleep(1000);
                try {
                    WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(5));
                    WebElement erweiternButton = wait1.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("button[_ngcontent-ng-c3721204639]")));
                    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", erweiternButton);

                    wait1.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button[_ngcontent-ng-c3721204639]")));
                    erweiternButton.click();
                    count++;
                    Thread.sleep(2000);
                } catch (Exception e) {
                    System.out.println("Kein weiterer Erweitern-Button gefunden. Ende der Seiten.");
                    moreJobsAvailable = false;
                }
        }
        repository.saveAll(jobOffers);
        driver.quit();
    }



    public void scrapeJobsFromXing(String JobTitle, String Ort) throws InterruptedException {
        for(JobOffer offer : repository.findAll()){
            if(offer.getType().equals("Xing")){
                repository.delete(offer);
            }
        }
        String URL = "https://www.xing.com/jobs/search?sc_o=jobs_search_button&sc_o_PropActionOrigin=losp_job_search&keywords="
                + JobTitle + "&location=" + Ort + "&id=538d6613c4a7c2b11d55ffa95306f949";

        List<JobOffer> jobOffers = new ArrayList<>();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-component-update");
        options.addArguments("--enable-default-apps");
        options.addArguments("--enable-extensions");

        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Henri\\Videos\\Java\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(options);
        driver.get(URL);
        Thread.sleep(1000);
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("localStorage.setItem('SEARCH_QUERY_COUNT', '{\"08e0b0da1e91145c884f8544e5700bd7\":3}');");
        js.executeScript("localStorage.setItem('uc_user_interaction', 'true');");
        js.executeScript("localStorage.setItem('uc_ui_version', '3.59.1');");
        js.executeScript("localStorage.setItem('uc_settings', '{\"controllerId\":\"1bef0918490e08b163868d79eb79562c1478fe70f38447321c32718872bcc9ae\",\"id\":\"Tr_3B1GDkkB1q2\",\"language\":\"de\"}');");
        js.executeScript("localStorage.setItem('uc_tcf', '{\"acString\":\"\",\"tcString\":\"\",\"timestamp\":1738090227442}');");
        driver.navigate().refresh();

        try {
            WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement acceptAllButton = wait1.until(ExpectedConditions.elementToBeClickable((By.xpath("//button[@data-testid='uc-accept-all-button' and text()='Akzeptieren']"))));
            acceptAllButton.click();
        } catch (Exception e) {
            System.out.println("No Cookie Banner found");
        }

        boolean gehtWeiter = true;
        boolean kommtNoch = true;
        int size = 0;
        Set<String> processedJobUrls = new HashSet<>();
        String mainWindowHandle = driver.getWindowHandle();

        while (gehtWeiter) {
            List<WebElement> elements = driver.findElements(By.cssSelector("a[data-testid='job-search-result']"));
            size = elements.size();
            for (WebElement job : elements) {
                String jobUrl = job.getAttribute("href");
                if (processedJobUrls.contains(jobUrl)) {
                    continue;
                }
                System.out.println(processedJobUrls.size());
                processedJobUrls.add(jobUrl);
                Thread.sleep(1000);
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", job);
                String Jobtitle = job.findElement(By.cssSelector("[data-testid='job-teaser-list-title']")).getText();
                System.out.println(Jobtitle);
                String Gehalt = "Kein Gehalt gefunden";
                String Company = driver.findElement(By.cssSelector("p.body-copy-styles__BodyCopy-sc-b3916c1b-0.bvzYHx.job-teaser-list-item-styles__Company-sc-54c129d4-6.jOpLYv")).getText();
                js.executeScript("window.open(arguments[0]);", jobUrl);
                Thread.sleep(1000);

                for (String windowHandle : driver.getWindowHandles()) {
                    if (!windowHandle.equals(mainWindowHandle)) {
                        driver.switchTo().window(windowHandle);
                        break;
                    }
                }

                WebDriverWait webDriverWait = new WebDriverWait(driver, Duration.ofSeconds(8));
                try {
                    if (kommtNoch) {
                        WebElement vielleichtSpäter = webDriverWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button[data-xds='TextButton'].text-button-styles__TextButton-sc-b5b49a5d-1.dyQMkN.dialog-styles__Action-sc-358cfb8c-6.iSiIIk")));
                        vielleichtSpäter.click();
                        kommtNoch = false;
                    }
                } catch (Exception e) {
                    System.out.println("vielleicht später not found");
                }
                try{
                    Gehalt = driver.findElement(By.cssSelector("li[data-testid='job-fact-salary']")).getText();
                    System.out.println(Gehalt);
                }catch(Exception e){
                    e.printStackTrace();
                    System.out.println("No Gehalt gefunden");
                }
                String description = "";
                try{
                    WebElement element = webDriverWait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[data-testid='expandable-content']")));
                     description = driver.findElement(By.cssSelector("div[data-testid='expandable-content']")).getText();
                }catch(Exception e){
                    description = "No description found";
                }

                JobOffer offer = JobOffer.builder()
                        .Ort(Ort)
                        .JobTitle(Jobtitle)
                        .type("Xing")
                        .HomeOffice("Not specified")
                        .Company(Company)
                        .url(jobUrl)
                        .gehalt(Gehalt)
                        .Description(description)
                        .build();
                jobOffers.add(offer);

                driver.close();
                driver.switchTo().window(mainWindowHandle);
                Thread.sleep(1000);
            }
            System.out.println(processedJobUrls.size() +" vor Modulo");
            System.out.println(size + "nach Modulo");
            if (processedJobUrls.size() % size == 0 ||
                    (processedJobUrls.size() % size) == 1 ||
                    (processedJobUrls.size() % size) == 2 ||
                    (processedJobUrls.size() % size) == 3 ||
                    (processedJobUrls.size() % size) == 4 ||
                    (processedJobUrls.size() % size) == 5 ||
            (size % processedJobUrls.size() == 0) || (size % processedJobUrls.size()) == 1 || (size % processedJobUrls.size()) == 2 )
                    {

                ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight);");
                try {
                    try {
                        JavascriptExecutor js2 = (JavascriptExecutor) driver;
                        long clickX = 100;
                        long clickY = 300;
                        js2.executeScript("document.elementFromPoint(arguments[0], arguments[1]).click();", clickX, clickY);
                        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(4));
                        WebElement closeButton = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[aria-label='Close'][data-xds='TextButton']")));
                        closeButton.click();

                    } catch (Exception e) {
                        System.out.println("Schließt nicht");
                        e.printStackTrace();
                    }
                    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(4));
                    WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//button[@data-xds='Button']//span[text()='Mehr anzeigen']")));
                    ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", button);
                    button.click();
                    Thread.sleep(1000);
                } catch (Exception e) {
                    System.out.println("Keine weiteren Jobs zu laden");
                    e.printStackTrace();
                    gehtWeiter = false;
                }
            } else {
                System.out.println("Button Clicken wurde geskipped");
                System.out.println("Weil Size war: " + size + " und Set war:" + processedJobUrls.size());
            }

        }
        repository.saveAll(jobOffers);
        driver.quit();
    }



    
    public List<JobOffer> getAllJobOffers(){
        return repository.findAll();
    }


    public List<JobOffer> getJobsWithSpecificSalary(double Salary){
        List<JobOffer> jobswithSpecificSalary = new ArrayList<>();
        List<JobOffer> allJobs = repository.findAll();
        for(JobOffer jobOffer : allJobs){
            if(!jobOffer.getGehalt().equals("Kein Gehalt gefunden")){
                String[] parts = jobOffer.getGehalt().split("-");
                String MaxSalary = parts[1].trim().split(" ")[0];
                String maxSalaryString = MaxSalary.replace(".", "");
                double maxSalary = Double.parseDouble(maxSalaryString);
                if(maxSalary >= Salary){
                    jobswithSpecificSalary.add(jobOffer);
                }
            }

        }
        return jobswithSpecificSalary;
    }

    public int getResultCount(){
        List<JobOffer> all = repository.findAll();
        int count = 0;
        for(JobOffer offer : all){
            count++;
        }
        return count;
    }

    public List<JobOffer> getJobsFromSpecificPlattForm(String Plattform){
        List<JobOffer> all = repository.findAll();
        List<JobOffer> jobsFromSpecificPlattform = new ArrayList<>();
        for(JobOffer offer: all){
            if(offer.getType().equals(Plattform)){
                jobsFromSpecificPlattform.add(offer);
            }
        }
        return jobsFromSpecificPlattform;
    }

    public List<JobOffer> SortJobsBasedOnHighestSalary() {
        List<JobOffer> all = repository.findAll();
        Collections.sort(all, new Comparator<JobOffer>() {

            public int compare(JobOffer j1, JobOffer j2) {
                try {
                    double maxSalaryJ1 = parseSalary(j1.getGehalt());
                    double maxSalaryJ2 = parseSalary(j2.getGehalt());
                    return Double.compare(maxSalaryJ2, maxSalaryJ1);
                } catch (Exception e) {
                    return 0;
                }
            }
            private double parseSalary(String gehalt) {
                if (gehalt.equals("Kein Gehalt gefunden")) {
                    return 0.0;
                }
                String[] parts = gehalt.split("-");
                String maxSalaryStr = parts[1].trim().split(" ")[0];
                maxSalaryStr = maxSalaryStr.replace(".", "");
                return Double.parseDouble(maxSalaryStr);
            }
        });

        return all;
    }

    public List<JobOffer> SortJobsBasedOnLowestSalary(){
        List<JobOffer> all = repository.findAll();
        Collections.sort(all, new Comparator<JobOffer>() {
            @Override
            public int compare(JobOffer o1, JobOffer o2) {
                try{
                    double maxSalaryJ1 = parseSalary(o1.getGehalt());
                    double maxSalaryJ2 = parseSalary(o2.getGehalt());
                    return Double.compare(maxSalaryJ1, maxSalaryJ2);
                }catch(Exception e){
                    return 0;
                }
            }
            private double parseSalary(String gehalt) {
                if (gehalt.equals("Kein Gehalt gefunden")) {
                    return Double.MAX_VALUE;
                }
                String[] parts = gehalt.split("-");
                String maxSalaryStr = parts[1].trim().split(" ")[0];
                maxSalaryStr = maxSalaryStr.replace(".", "");
                return Double.parseDouble(maxSalaryStr);
            }
        });
        return all;
    }

    public List<JobOffer> searchJobOffersByKeyWord(String KeyWord){
        List<JobOffer> all = repository.findAll();
        List<JobOffer> MatchingJobOffers = new ArrayList<>();
        for(JobOffer offer : all){
            if(offer.getDescription().contains(KeyWord) || offer.getJobTitle().contains(KeyWord) || offer.getCompany().contains(KeyWord)){
                MatchingJobOffers.add(offer);
            }
        }
        return MatchingJobOffers;
    }


    public String getAverageSalaryFromNiche(String JobTitle){
        String URL = "https://www.jobvector.de/gehalt/"+ JobTitle+"/";
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-component-update");
        options.addArguments("--enable-default-apps");
        options.addArguments("--enable-extensions");

        System.setProperty("webdriver.chrome.driver", "C:\\Users\\Henri\\Videos\\Java\\chromedriver.exe");
        WebDriver driver = new ChromeDriver(options);
        driver.get(URL);

        String Gehalt = driver.findElement(By.cssSelector(".avg")).getText();
        driver.quit();
        return Gehalt;
    }

    public String writeApplicationWithHelpOfKi(BewerbungsInfos infos) throws JsonProcessingException {

        StringBuilder prompt = new StringBuilder();
        prompt.append("Hallo Gemini ich möchte das du mir eine Bewerbung Schreibst für ein Unternehmen für ein Job, mein Name ist");
        prompt.append(infos.name).append(" ,");
        prompt.append(" das Unternehmen lässt sich mit folgenden Wörtern beschreiben: ");
        for(String keyWordCompany : infos.KeyWordsCompany){
            prompt.append(keyWordCompany).append(", ");
        }
        prompt.append(" es heißt: ");
        prompt.append(infos.CompanyName).append(" und ist in folgender Branche tätig: ");
        prompt.append(infos.Branche).append(" Ich beschreibe mich wie folgt: ");
        for(String keyWordMe: infos.KeyWordsMe){
            prompt.append(keyWordMe).append(", ");
        }
        prompt.append(" bitte formuliere eine Seriöse und gut ausformulierte Bewerbung für einen Job, bitte nur eine Bewerbung die ich Sofort Kopieren kann ");

        String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=%s";
        String geminiKey = "your API Key";
        String API_URL = String.format(API_URL_TEMPLATE, geminiKey);
        ObjectMapper mapper = new ObjectMapper();
        String promptReal = prompt.toString();
        String requestBody = mapper.writeValueAsString(
                mapper.createObjectNode().set("contents",
                        mapper.createArrayNode().add(mapper.createObjectNode().set("parts",
                                mapper.createArrayNode().add(mapper.createObjectNode().put("text", promptReal))))));
        HttpEntity<String> request = new HttpEntity<>(requestBody);
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);
        JsonNode node = mapper.readTree(response.getBody());
        String answer = node.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        String modifiedAnswer = answer.replaceAll("\\*", "");
        return modifiedAnswer;
    }








}
