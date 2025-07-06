import { IeventResponse } from "./ievent-response";

export interface IeventGroupResponse {
  message: string;
  eventoActividades: IeventResponse[];
}
