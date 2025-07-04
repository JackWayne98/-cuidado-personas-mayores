import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { lastValueFrom } from "rxjs";
import { Ievent } from "../interfaces/ievent";
import { IeventResponse } from "../interfaces/ievent-response";

@Injectable({
  providedIn: "root",
})
export class EventActivityService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/evento-actividad`;
  private token = localStorage.getItem("token");

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `${this.token}`,
      "Content-Type": "application/json",
    });
  }
  getAllEvents(): Promise<{ events: IeventResponse[] }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return lastValueFrom(
      this.http.get<{ events: IeventResponse[] }>(`${this.endpoint}`, {
        headers,
      })
    );
  }
  createIndividualEvent(data: Ievent): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.post<any>(`${this.endpoint}`, data, { headers })
    );
  }

  createRecurrentEvent(data: Ievent): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.post<any>(`${this.endpoint}/recurrentes`, data, { headers })
    );
  }
}
