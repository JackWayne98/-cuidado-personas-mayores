import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { lastValueFrom } from "rxjs";
import { Ievent } from "../interfaces/ievent";
import { IeventResponse } from "../interfaces/ievent-response";
import { IeventGroupResponse } from "../interfaces/ievent-group";
import { IeventSingle } from "../interfaces/ievent-single";

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
    const headers = this.getAuthHeaders();
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

  getRecurrentGroupEvents(groupId: string): Promise<IeventGroupResponse> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.get<IeventGroupResponse>(
        `${this.endpoint}/recurrentes/${groupId}`,
        { headers }
      )
    );
  }

  getEventById(eventId: number): Promise<IeventSingle> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.get<IeventSingle>(`${this.endpoint}/${eventId}`, {
        headers,
      })
    );
  }

  updateIndividualEvent(eventId: number, data: Partial<Ievent>): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.put<any>(`${this.endpoint}/${eventId}`, data, { headers })
    );
  }

  updateRecurrentGroup(groupId: string, data: Partial<Ievent>): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.put<any>(`${this.endpoint}/recurrentes/${groupId}`, data, {
        headers,
      })
    );
  }

  updateEventStatus(eventId: number, estado: string): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.put<any>(
        `${this.endpoint}/${eventId}/status`,
        { estado },
        { headers }
      )
    );
  }

  deleteIndividualEvent(eventId: number): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.delete<any>(`${this.endpoint}/${eventId}`, { headers })
    );
  }

  deleteRecurrentGroup(groupId: string): Promise<any> {
    const headers = this.getAuthHeaders();
    return lastValueFrom(
      this.http.delete<any>(`${this.endpoint}/recurrentes/${groupId}`, {
        headers,
      })
    );
  }
}
