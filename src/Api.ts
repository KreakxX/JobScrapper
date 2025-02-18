import React from "react";
import axios from 'axios';
import { Lebenslauf } from "Lebenslauf";
import { BewerbungsInfos } from "BewerbungsInfos";

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/Job'
});




export const getJobOfferFromStepstone = async(Jobtitle: string, Ort: string) =>{
  try{
    const API_Response = await api.get(`/scrape/Jobs/from/Stepstone/${Jobtitle}/${Ort}`)
    return API_Response.data ;
  }catch(error){
    console.log(error);
    throw error;
  }
}


export const getJobOfferFromIndeed = async(Jobtitle: string, Ort: string) =>{
  try{
    const API_Response = await api.get(`/scrappe/Jobs/from/Indeed/${Jobtitle}/${Ort}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getJobOffers = async() =>{
  try{
    const API_Response = await api.get("/get/Job/Offers");
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getJobOffersWithSpecificGehalt = async(Gehalt: number)=>{
  try{
    const API_Response = await api.get(`/get/Job/Offers/${Gehalt}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getJobOfferFromAgenturFürArbeit = async(Jobtitle: string, Ort: string)=>{
  try{
    const API_Response = await api.get(`/scrappe/Jobs/from/AgentureFürArbeit/${Jobtitle}/${Ort}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getResultCount = async()=>{
  try{
    const API_Response = await api.get("/get/result/count");
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getJobsFromSpecificPlattform = async(plattform: string) =>{
  try{
    const API_Response = await api.get(`/get/jobs/from/plattform/${plattform}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getJobOffersFromXing = async(Jobtitle: string , Ort: string) =>{
  try{
    const API_Response = await api.get(`/scrappe/Jobs/from/Xing/${Jobtitle}/${Ort}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const SortOffersBasedOnHighesSalary = async() =>{
  try{
    const API_Response = await api.get("/sort/JobOffers/based/on/maxed/Salary");
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const SortOffersBasedOnLowestSalary = async()=>{
  try{
    const API_Response = await api.get("/sort/JobOffers/based/on/lowest/Salary");
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const SearchJobOffersBasedOnKeyWord = async(Keyword: string) =>{
  try{
    const API_Response = await api.get(`/search/by/keyword/${Keyword}`)
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getAverageSalaryFromJob = async(Title: string ) =>{
  try{
    const API_Response = await api.get(`/get/average/Salary/from/Job/${Title}`);
    return API_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const generatePerfectLebenslauf = async(lebenslauf: Lebenslauf, Path: string) =>{
  try{
    const API_Response = await api.post(`/generate/perfect/lebenslauf/${Path}`,lebenslauf);
  }catch(error){
    console.log(error);
    throw error;
  }

}

export const generatePerfectApplication = async(infos: BewerbungsInfos) =>{
  try{
    const API_Response = await api.post(`/write/Bewerbung`,infos);
    return API_Response.data;
    return
  }catch(error){
    console.log(error);
    throw error;
  }

}