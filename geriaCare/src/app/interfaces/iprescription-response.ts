import { IPrescription } from "./iprescriptions";

export interface IprescriptionResponse {
  success: boolean;
  recetas: IPrescription[];
}
