import { Beruf } from "Beruf";
import { Schule } from "Schule";

export interface Lebenslauf{
  vorname: string,
  nachname: string,
  email: string,
  telefonNummer: string,
  adresse: string,
  geburtsdatum: string,
  github: string,
  description: string,
  skills: string [],
  berufserfahrungen: Beruf [],
  sprachen: string [],
  zertifikate: string [],
  bildung: Schule []


}