import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { Ievent } from "../interfaces/ievent";
import { lastValueFrom } from "rxjs";
import { IeventResponse } from "../interfaces/ievent-response";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/evento-actividad`;

  private getHeaders() {
    const token = localStorage.getItem("token");
    return new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });
  }
  createEvent(data: Ievent): Promise<Ievent> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.post<Ievent>(this.endpoint, data, { headers })
    );
  }

  createRecurrentEvent(data: any): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.post<any>(`${this.endpoint}/recurrentes`, data, { headers })
    );
  }
  getEventById(id: number): Promise<Ievent> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.get<Ievent>(`${this.endpoint}/${id}`, { headers })
    );
  }
  getAllEvents(): Promise<{ events: IeventResponse[] }> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.get<{ events: IeventResponse[] }>(this.endpoint, { headers })
    );
  }
  updateEvent(id: number, data: Partial<Ievent>): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.put<any>(`${this.endpoint}/${id}`, data, { headers })
    );
  }
  updateEventStatus(id: number, estado: string): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.put<any>(
        `${this.endpoint}/${id}/status`,
        { estado },
        { headers }
      )
    );
  }

  deleteEvent(id: number): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.delete<any>(`${this.endpoint}/${id}`, { headers })
    );
  }
  updateRecurrentGroup(grupo_recurrencia_id: string, data: any): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.put<any>(
        `${this.endpoint}/recurrentes/${grupo_recurrencia_id}`,
        data,
        { headers }
      )
    );
  }

  deleteRecurrentGroup(grupo_recurrencia_id: string): Promise<any> {
    const headers = this.getHeaders();
    return lastValueFrom(
      this.http.delete<any>(
        `${this.endpoint}/recurrentes/${grupo_recurrencia_id}`,
        { headers }
      )
    );
  }
}
