import { IemergencyContact } from "./iemergency-contact";

export interface IemergencyResponse {
  success: boolean;
  contactos: IemergencyContact[];
}
