import { Ielder } from "./ielder";
import { IPrescription } from "./iprescriptions";
export interface IelderWithPrescriptions {
  elder: Ielder;
  prescriptions: IPrescription[];
}
