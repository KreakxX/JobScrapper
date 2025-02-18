import {
  Search,
  MapPin,
  Filter,
  Key,
  Bold,
  House,
  DollarSign,
  LucideWorkflow,
  BriefcaseBusiness,
  HardHat,
  SquareTerminal,
  KeyIcon,
  KeyRound,
  FileUser,
  File,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { useState } from "react";
import { JobOffer } from "./JobOffer";
import {
  generatePerfectApplication,
  generatePerfectLebenslauf,
  getAverageSalaryFromJob,
  getJobOfferFromAgenturFürArbeit,
  getJobOfferFromStepstone,
  getJobOffers,
  getJobOffersFromXing,
  getJobOffersWithSpecificGehalt,
  getJobsFromSpecificPlattform,
  getResultCount,
  SearchJobOffersBasedOnKeyWord,
  SortOffersBasedOnHighesSalary,
  SortOffersBasedOnLowestSalary,
} from "./Api";
import { toast, Toaster } from "sonner";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "./components/ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { Separator } from "./components/ui/separator";
import { Toggle } from "./components/toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { AlertDialogTrigger } from "components/ui/alert-dialog";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { Schule } from "Schule";
import { Beruf } from "Beruf";
import { Lebenslauf } from "Lebenslauf";
import { BewerbungsInfos } from "BewerbungsInfos";

const Page: React.FC = () => {
  const [jobName, setJobName] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [gehalt, setGehalt] = useState<number>(0);
  const [scrappedJobs, setScrappedJobs] = useState<JobOffer[]>([]);
  const [ResultCount, setResultCount] = useState<number>(0);
  const [homeOffice, setHomeOffice] = useState<boolean>(false);
  const [GehaltBool, setGehaltbool] = useState<boolean>(false);
  const [stepstone, setStepstone] = useState<boolean>(false);
  const [Agentur, setAgentur] = useState<boolean>(false);
  const [Xing, setXing] = useState<boolean>(false);
  const [averageSalary, setAverageSalary] = useState<string>("");
  const [expandedJobs, setExpandedJobs] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [vorname, setVorname] = useState<string>("");
  const [nachname, setNachname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefonNummer, setTelefonNummer] = useState<string>("");
  const [adresse, setAdresse] = useState<string>("");
  const [geburtsdatum, setGeburtsdatum] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [skill1, setSkill1] = useState<string>("");
  const [skill2, setSkill2] = useState<string>("");
  const [skill3, setSkill3] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([skill1, skill2, skill3]);
  const [sprache1, setSprache1] = useState<string>("");
  const [sprache2, setSprache2] = useState<string>("");
  const [zertifikat1, setZertifikat1] = useState<string>("");
  const [zertifikat2, setZertifikat2] = useState<string>("");

  const [schulname1, setSchulname1] = useState<string>("");
  const [schulname2, setSchulname2] = useState<string>("");
  const [schulOrt1, setSchulOrt1] = useState<string>("");
  const [schulOrt2, setSchulOrt2] = useState<string>("");
  const [klassen1, setKlassen1] = useState<string>("");
  const [klassen2, setKlassen2] = useState<string>("");

  const [jobtitle1, setJobtitle1] = useState<string>("");
  const [jobtitle2, setJobtitle2] = useState<string>("");
  const [dauer1, setDauer1] = useState<number>(0);
  const [dauer2, setDauer2] = useState<number>(0);
  const [tätigkeit1, setTätigkeit1] = useState<string>("");
  const [tätigkeit2, setTätigkeit2] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [companyname, setCompanyname] = useState<string>("");
  const [branche, setBranche] = useState<string>("");

  const [keywordme1, setKeywordme1] = useState<string>("");
  const [keywordme2, setKeywordme2] = useState<string>("");
  const [keywordme3, setKeywordme3] = useState<string>("");

  const [keywordCompany1, setKeywordCompany1] = useState<string>("");
  const [keywordCompany2, setKeywordCompany2] = useState<string>("");
  const [keywordCompany3, setKeywordCompany3] = useState<string>("");

  const [Bewerbung, setBewerbung] = useState<string>("");

  const generatePerfectResume = async () => {
    try {
      const lebenslauf: Lebenslauf = {
        vorname,
        nachname,
        email,
        telefonNummer: telefonNummer,
        adresse,
        geburtsdatum,
        github,
        description,
        skills: [skill1, skill2, skill3],
        berufserfahrungen: [
          { jobtitle: jobtitle1, dauer: dauer1, description: tätigkeit1 },
          { jobtitle: jobtitle2, dauer: dauer2, description: tätigkeit2 },
        ],
        sprachen: [sprache1, sprache2],
        zertifikate: [zertifikat1, zertifikat2],
        bildung: [
          { name: schulname1, ort: schulOrt1, klassen: klassen1 },
          { name: schulname2, ort: schulOrt2, klassen: klassen2 },
        ],
      };
      await generatePerfectLebenslauf(lebenslauf, "Lebenslauf_Henrik.pdf");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const GeneratePerfectApplication = async () => {
    try {
      const infos: BewerbungsInfos = {
        keyWordsCompany: [keywordCompany1, keywordCompany2, keywordCompany3],
        keyWordsMe: [keywordme1, keywordme2, keywordme3],
        name,
        companyname,
        branche,
      };

      const response = await generatePerfectApplication(infos);
      setBewerbung(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const scrapeJobs = async () => {
    try {
      if (jobName !== "" && jobLocation !== "") {
        if (stepstone) {
          await getJobOfferFromStepstone(jobName, jobLocation);
        }
        if (Xing) {
          await getJobOffersFromXing(jobName, jobLocation);
        }
        if (Agentur) {
          await getJobOfferFromAgenturFürArbeit(jobName, jobLocation);
        }
      } else {
        toast.error("Provide more Info");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const GetAverageSalaryFromJob = async () => {
    try {
      setAverageSalary("");
      const averageSalary = await getAverageSalaryFromJob(jobName);
      setAverageSalary(averageSalary);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const searchJobsBySpecificKeyWord = async () => {
    try {
      const response = await SearchJobOffersBasedOnKeyWord(jobName);
      setScrappedJobs(response);
    } catch (error) {
      console.log(error);
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

  const SortJobOffersbasedOnHighesSalary = async () => {
    try {
      const response = await SortOffersBasedOnHighesSalary();
      console.log(response);
      if (response) {
        setScrappedJobs(response);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const SortJobOffersbasedOnLowestSalary = async () => {
    try {
      const response = await SortOffersBasedOnLowestSalary();
      console.log(response);
      if (response) {
        setScrappedJobs(response);
      }
    } catch (error) {
      console.log(error);
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
    <div className="min-h-screen bg-background">
      <div className="flex justify-end relative  top-10 right-10">
        <div className="flex justify-between gap-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-zinc-900 hover:bg-zinc-900">
                Generate CV <FileUser></FileUser>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create the perfect CV</DialogTitle>
                <DialogDescription>
                  Create with the help of a template the perfect CV, and get
                  hired! If you dont have for example Berufserfahrung just leave
                  the fields empty.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[500px] w-[500px] scrollbar-hidden ">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setVorname(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Firstname"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setNachname(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Lastname"
                      type="text"
                    ></Input>
                  </div>
                  <Separator className="bg-gray-500 mt-3 w-[480px]"></Separator>

                  <Input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="w-[480px] border-black"
                    placeholder="Email"
                    type="text"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setTelefonNummer(e.target.value);
                    }}
                    className="w-[480px] border-black"
                    placeholder="Telefonnummer"
                    type="text"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setAdresse(e.target.value);
                    }}
                    className="w-[480px] border-black"
                    placeholder="Adresse"
                    type="text"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setGithub(e.target.value);
                    }}
                    className="w-[480px] border-black"
                    placeholder="Github Link"
                    type="text"
                  ></Input>
                  <Textarea
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    className="w-[480px] border-black"
                    placeholder="Description"
                  ></Textarea>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setSkill1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Skill 1"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setSkill2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Skill 2"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setSkill3(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Skill 3"
                      type="text"
                    ></Input>
                  </div>
                  <Separator className="bg-gray-500 mt-3 w-[480px]"></Separator>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setSprache1(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Sprache 1"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setSprache2(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Sprache 2"
                      type="text"
                    ></Input>
                  </div>
                  <Separator className="bg-gray-500 mt-3 w-[480px]"></Separator>

                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setZertifikat1(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Zertifikat 1"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setZertifikat2(e.target.value);
                      }}
                      className="w-[230px] border-black"
                      placeholder="Zertifikat 2"
                      type="text"
                    ></Input>
                  </div>
                  <Separator className="bg-gray-500 mt-3 w-[480px]"></Separator>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setSchulname1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Schulname"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setSchulOrt1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Ort"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setKlassen1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Klassen"
                      type="text"
                    ></Input>
                  </div>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setSchulname2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Schulname"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setSchulOrt2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Ort"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setKlassen2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Klassen"
                      type="text"
                    ></Input>
                  </div>
                  <Separator className="bg-gray-500 mt-3 w-[480px]"></Separator>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setJobtitle1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Jobtitel"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setDauer1(parseInt(e.target.value));
                      }}
                      className="w-[150px] border-black"
                      placeholder="Dauer"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setTätigkeit1(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Tätigkeit"
                      type="text"
                    ></Input>
                  </div>
                  <div className="flex justify-between w-[480px]">
                    <Input
                      onChange={(e) => {
                        setJobtitle2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Jobtitle"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setDauer2(parseInt(e.target.value));
                      }}
                      className="w-[150px] border-black"
                      placeholder="Dauer"
                      type="text"
                    ></Input>
                    <Input
                      onChange={(e) => {
                        setTätigkeit2(e.target.value);
                      }}
                      className="w-[150px] border-black"
                      placeholder="Tätigkeit"
                      type="text"
                    ></Input>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  onClick={() => {
                    generatePerfectResume();
                  }}
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-900 mr-5 mt-5"
                >
                  Create CV
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-zinc-900 hover:bg-zinc-900">
                Generate Application <File></File>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create the perfect Application</DialogTitle>
                <DialogDescription>
                  Create with the help of AI the perfect Application, and get
                  hired!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="border-black"
                  placeholder="Name"
                ></Input>
                <Input
                  onChange={(e) => {
                    setCompanyname(e.target.value);
                  }}
                  className="border-black"
                  placeholder="Company"
                ></Input>
                <Input
                  onChange={(e) => {
                    setBranche(e.target.value);
                  }}
                  className="border-black"
                  placeholder="Branche"
                ></Input>
                <h1 className="mt-7">About you:</h1>
                <Separator className="bg-gray-500 "></Separator>

                <div className="flex justify-between gap-2">
                  <Input
                    onChange={(e) => {
                      setKeywordme1(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 1"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setKeywordme2(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 2"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setKeywordme3(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 3"
                  ></Input>
                </div>
                <h1 className="mt-7">About the Company:</h1>
                <Separator className="bg-gray-500  "></Separator>

                <div className="flex justify-between gap-2">
                  <Input
                    onChange={(e) => {
                      setKeywordCompany1(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 1"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setKeywordCompany2(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 2"
                  ></Input>
                  <Input
                    onChange={(e) => {
                      setKeywordCompany3(e.target.value);
                    }}
                    className="border-black"
                    placeholder="Keyword 3"
                  ></Input>
                </div>

                <Textarea
                  className="h-[300px]"
                  placeholder="heres gonna be the Application"
                  value={Bewerbung}
                ></Textarea>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    GeneratePerfectApplication();
                  }}
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-900 mr-5 mt-5"
                >
                  Create Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Toaster />
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between w-[200px]">
              <img
                className="w-[70px] h-[70px]"
                src="\Images\Logo_for_Software_Jobfusion__a_platform_for_web_scraping_jobs-removebg-preview.png"
                alt=""
              />
              <h1 className="text-2xl font-bold text-primary">JobFusion</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-muted/50 py-4">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-center text-3xl font-bold tracking-tight ">
              Find Your Dream Job
            </h2>
            <div className="flex justify-center items-center ">
              <div className="flex justify-between gap-4 w-[700px] mb-5 ">
                {homeOffice ? (
                  <Button
                    onClick={() => {
                      setHomeOffice(!homeOffice);
                    }}
                    className="bg-zinc-800 border border-black rounded-2xl w-[150px] hover:bg-zinc-800 "
                  >
                    <span className="text-white">Home Office</span>
                    <House className="text-white"></House>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setHomeOffice(!homeOffice);
                    }}
                    className="bg-white border border-black rounded-2xl w-[150px] hover:bg-white "
                  >
                    <span className="text-black">Home Office</span>
                    <House className="text-black"></House>
                  </Button>
                )}

                {GehaltBool ? (
                  <Button
                    onClick={() => {
                      setGehaltbool(!GehaltBool);
                    }}
                    className="bg-zinc-800 border border-black rounded-2xl w-[150px] hover:bg-zinc-800 "
                  >
                    <span className="text-white">Gehalt</span>
                    <DollarSign className="text-white"></DollarSign>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setGehaltbool(!GehaltBool);
                    }}
                    className="bg-white border border-black rounded-2xl w-[150px] hover:bg-white "
                  >
                    <span className="text-black">Gehalt</span>
                    <DollarSign className="text-black"></DollarSign>
                  </Button>
                )}

                {stepstone ? (
                  <Button
                    onClick={() => {
                      setStepstone(!stepstone);
                    }}
                    className="bg-zinc-800 border border-black rounded-2xl w-[150px] hover:bg-zinc-800 "
                  >
                    <span className="text-white">Stepstone</span>
                    <BriefcaseBusiness className="text-white"></BriefcaseBusiness>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setStepstone(!stepstone);
                    }}
                    className="bg-white border border-black rounded-2xl w-[150px] hover:bg-white "
                  >
                    <span className="text-black">Stepstone</span>
                    <BriefcaseBusiness className="text-black"></BriefcaseBusiness>
                  </Button>
                )}

                {Agentur ? (
                  <Button
                    onClick={() => {
                      setAgentur(!Agentur);
                    }}
                    className="bg-zinc-800 border border-black rounded-2xl w-[160px] hover:bg-zinc-800 "
                  >
                    <span className="text-white">Agentur für Arbeit</span>
                    <HardHat className="text-white"></HardHat>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setAgentur(!Agentur);
                    }}
                    className="bg-white border border-black rounded-2xl w-[160px] hover:bg-white "
                  >
                    <span className="text-black">Agentur für Arbeit</span>
                    <HardHat className="text-black"></HardHat>
                  </Button>
                )}

                {Xing ? (
                  <Button
                    onClick={() => {
                      setXing(!Xing);
                    }}
                    className="bg-zinc-800 border border-black rounded-2xl w-[150px] hover:bg-zinc-800 "
                  >
                    <span className="text-white">Xing</span>
                    <Search className="text-white"></Search>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setXing(!Xing);
                    }}
                    className="bg-white border border-black rounded-2xl w-[150px] hover:bg-white "
                  >
                    <span className="text-black">Xing</span>
                    <Search className="text-black"></Search>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 w-[1000px] relative right-9 ">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={(e) => {
                    setJobName(e.target.value);
                  }}
                  placeholder="Job title or keyword"
                  className="pl-9 border-black"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  className="pl-9 border-black"
                  onChange={(e) => {
                    setJobLocation(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  onClick={() => {
                    scrapeJobs();
                  }}
                  className="w-full md:w-auto bg-zinc-900 hover:bg-zinc-900"
                >
                  Search Jobs
                </Button>
                <Button
                  className="bg-zinc-900 hover:bg-zinc-900"
                  onClick={() => {
                    getScrappedJobs();
                  }}
                >
                  Load existing Jobs
                </Button>
                <Button
                  className="bg-zinc-900 hover:bg-zinc-900"
                  onClick={() => {
                    searchJobsBySpecificKeyWord();
                  }}
                >
                  Load by Keywords
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-zinc-900 hover:bg-zinc-900"
                      onClick={() => {
                        GetAverageSalaryFromJob();
                      }}
                    >
                      Get Average Salary
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Average Salary</DialogTitle>
                      <DialogDescription>
                        Average Salary of a {jobName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="">
                      {averageSalary == "" ? (
                        <h1>Loading ... </h1>
                      ) : (
                        <h1>{averageSalary} </h1>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-8">
        <div className="mb-6 flex items-center justify-between relative bottom-10 ">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{ResultCount} Jobs Found</h3>
          </div>
          <div className="flex  justify-between w-[750px] gap-4 mt-5">
            <Card
              onClick={() => {
                GetJobsFromSpecificPlattform("Stepstone");
              }}
              className="w-[230px] border-none h-[100px] "
            >
              <CardContent className="p-0 h-[185px] lg:h-[235px] xl:h-[285px] relative">
                <div
                  className="relative h-[100px] bg-cover bg-center group-hover:brightness-75 transition-all rounded-lg"
                  style={{
                    backgroundImage: `url('/Images/stepstone-logo-visual.jpg')`,
                  }}
                >
                  {" "}
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-70 transition-all rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
            <Card
              onClick={() => {
                GetJobsFromSpecificPlattform("Agentur Für Arbeit");
              }}
              className="w-[230px] border-none h-[100px]"
            >
              <CardContent className="p-0 h-[185px] lg:h-[235px] xl:h-[285px] relative">
                <div
                  className="relative h-[100px] bg-contain bg-no-repeat bg-center group-hover:brightness-75 transition-all rounded-lg"
                  style={{
                    backgroundImage: `url('/Images/AgenturFuerArbeit.png')`,
                  }}
                >
                  {" "}
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-70 transition-all rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
            <Card
              onClick={() => {
                GetJobsFromSpecificPlattform("Xing");
              }}
              className="w-[230px] border-none h-[100px]"
            >
              <CardContent className="p-0 h-[185px] lg:h-[235px] xl:h-[285px] relative">
                <div
                  className="relative h-[100px] bg-cover bg-no-repeat bg-center group-hover:brightness-75 transition-all rounded-lg"
                  style={{
                    backgroundImage: `url('/Images/Screenshot 2025-01-25 130334.png')`,
                  }}
                >
                  {" "}
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-70 transition-all rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center gap-4">
            <Select
              onValueChange={(e) => {
                if (e == "salary-high") {
                  SortJobOffersbasedOnHighesSalary();
                } else {
                  SortJobOffersbasedOnLowestSalary();
                }
              }}
              defaultValue="relevance"
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[770px] w-full relative bottom-5 ">
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
                  className="bg-white border-black text-white   transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold line-clamp-2 text-black">
                      {job.jobTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2 text-black">
                        <span className="text-zinc-900 font-medium">
                          Company:
                        </span>
                        {job.company}
                      </p>
                      <p className="flex items-center gap-2 text-black">
                        <span className="text-zinc-900 font-medium">
                          Location:
                        </span>
                        {job.ort}
                      </p>
                      {job.gehalt && (
                        <p className="flex items-center gap-2 text-black">
                          <span className="text-zinc-900 font-medium">
                            Salary:
                          </span>
                          {job.gehalt}
                        </p>
                      )}
                      {job.homeOffice && (
                        <p className="flex items-center gap-2 text-black">
                          <span className="text-zinc-900 font-medium">
                            Remote:
                          </span>
                          {job.homeOffice}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-black">
                        {isExpanded ? job.description : shortDescription}
                      </p>
                      {job.description.length > 150 && (
                        <button
                          onClick={() => toggleDescription(index)}
                          className="text-zinc-900 hover:text-zinc-900 text-sm font-medium"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                    <div className="pt-4">
                      <Button
                        className="w-full bg-zinc-900 hover:bg-zinc-900 transition-colors"
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
                    <p className="text-sm text-zinc-500">
                      Source:{" "}
                      <span className="font-medium text-zinc-900">
                        {job.type}
                      </span>
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex justify-center items-center mt-10">
          <h1 className=" text-2xl">Q & A</h1>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Accordion type="single" collapsible className="w-[500px]">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Why use JobFusion over other Job plattforms ?
              </AccordionTrigger>
              <AccordionContent>
                Because with JobFusion you can easily get Jobs from multiple
                Plattforms and you can easily see all of them on one site.
              </AccordionContent>
            </AccordionItem>
            <Separator className="bg-gray-500 mt-3 mb-5"></Separator>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it free?</AccordionTrigger>
              <AccordionContent>
                Yes, JobFusion is completly free to use.
              </AccordionContent>
            </AccordionItem>
            <Separator className="bg-gray-500 mt-3 mb-5"></Separator>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can i see the Jobs from the other Plattforms ?
              </AccordionTrigger>
              <AccordionContent>
                Yes, with JobFusion you can visit the Job Offer from the origin
                Plattform.
              </AccordionContent>
            </AccordionItem>
            <Separator className="bg-gray-500 mt-3 mb-5"></Separator>
          </Accordion>
        </div>
      </main>
    </div>
  );
};
export default Page;
