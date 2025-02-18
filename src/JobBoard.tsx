import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useState } from "react";
import type { JobOffer } from "./JobOffer";
import {
  getJobOffers,
  getJobOffersFromXing,
  getJobOffersWithSpecificGehalt,
  getJobsFromSpecificPlattform,
  getResultCount,
} from "./Api";
import { toast, Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";

const JobBoard: React.FC = () => {
  const [jobName, setJobName] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [gehalt, setGehalt] = useState<number>(0);
  const [scrappedJobs, setScrappedJobs] = useState<JobOffer[]>([]);
  const [ResultCount, setResultCount] = useState<number>(0);
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>(
    {}
  );

  const scrapeJobs = async () => {
    try {
      if (jobName !== "" && jobLocation !== "") {
        await getJobOffersFromXing(jobName, jobLocation);
      } else {
        toast.error("Provide more Info");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getScrappedJobs = async () => {
    try {
      const response = await getJobOffers();
      const resultCount = await getResultCount();
      setResultCount(resultCount);
      if (response) {
        setScrappedJobs(response);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getJobsWithSpecificSalary = async () => {
    try {
      const response = await getJobOffersWithSpecificGehalt(gehalt);
      if (response) {
        setScrappedJobs(response);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const GetJobsFromSpecificPlattform = async (plattform: string) => {
    try {
      const response = await getJobsFromSpecificPlattform(plattform);
      setScrappedJobs(response);
      setResultCount(response.length);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const toggleDescription = (index: number) => {
    setExpandedJobs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="bg-zinc-800 min-h-screen">
      <div className="container mx-auto p-4">
        <Toaster />
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-blue-400">JobFusion</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-4xl">
              <Input
                type="text"
                placeholder="Enter job name"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                className="w-full md:w-[400px] text-white"
              />
              <Input
                type="text"
                placeholder="Enter Location"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full md:w-[200px] text-white"
              />
              <Input
                type="text"
                placeholder="Enter Minimum Salary"
                onChange={(e) => setGehalt(Number.parseInt(e.target.value, 10))}
                className="w-full md:w-[200px] text-white"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
                onClick={scrapeJobs}
              >
                Scrape Jobs
              </Button>
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
                onClick={getScrappedJobs}
              >
                Load All Jobs
              </Button>
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
                onClick={getJobsWithSpecificSalary}
              >
                Filter by Salary
              </Button>
            </div>
          </div>

          {/* Platform Cards */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              ({ResultCount}) Jobs found
            </h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {[
                {
                  name: "Stepstone",
                  image: "/Images/stepstone-logo-visual.jpg",
                },
                {
                  name: "Agentur Für Arbeit",
                  image: "/Images/AgenturFuerArbeit.png",
                },
                {
                  name: "Xing",
                  image: "/Images/Screenshot 2025-01-25 130334.png",
                },
              ].map((platform) => (
                <Card
                  key={platform.name}
                  onClick={() => GetJobsFromSpecificPlattform(platform.name)}
                  className="w-[230px] border-none hover:scale-105 transition-transform cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div
                      className="relative h-[100px] bg-contain bg-no-repeat bg-center rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url('${platform.image}')`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[690px] w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scrappedJobs.map((job, index) => {
                const isExpanded = expandedJobs[index] || false;
                const shortDescription =
                  job.description.length > 150
                    ? job.description.substring(0, 150) + "..."
                    : job.description;

                return (
                  <Card
                    key={index}
                    className="bg-zinc-700/90 text-white border-none hover:bg-zinc-700 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl font-bold line-clamp-2">
                        {job.jobTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <span className="text-blue-400">Company:</span>
                          {job.company}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-blue-400">Location:</span>
                          {job.ort}
                        </p>
                        {job.gehalt && (
                          <p className="flex items-center gap-2">
                            <span className="text-blue-400">Salary:</span>
                            {job.gehalt}
                          </p>
                        )}
                        {job.homeOffice && (
                          <p className="flex items-center gap-2">
                            <span className="text-blue-400">Remote:</span>
                            {job.homeOffice}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-zinc-300">
                          {isExpanded ? job.description : shortDescription}
                        </p>
                        {job.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(index)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                      <div className="pt-4">
                        <Button
                          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
                          asChild
                        >
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Job
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4">
                      <p className="text-sm text-zinc-400">
                        Source:{" "}
                        <span className="font-medium text-blue-400">
                          {job.type}
                        </span>
                      </p>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
