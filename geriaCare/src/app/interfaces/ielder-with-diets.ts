import { Idiet } from "./idiet";
import { Ielder } from "./ielder";

export interface IelderWithDiets {
  elder: Ielder;
  diets: Idiet[];
}
