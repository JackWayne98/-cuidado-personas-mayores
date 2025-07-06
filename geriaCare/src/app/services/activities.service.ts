import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { Iactivity } from "../interfaces/iactivity";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ActivitiesService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/actividades`;

  createActivity(
    data: Iactivity
  ): Promise<{ success: boolean; message: string; actividad: Iactivity }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });
    return lastValueFrom(
      this.http.post<{
        success: boolean;
        message: string;
        actividad: Iactivity;
      }>(this.endpoint, data, { headers })
    );
  }
  getAllActivities(): Promise<{ actividades: Iactivity[] }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<{ actividades: Iactivity[] }>(
        `${this.endpoint}/usuario`, // updated path here!
        { headers }
      )
    );
  }
  getActivitiesByElderId(elderId: number): Promise<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<any>(`${this.endpoint}/persona-mayor/${elderId}`, {
        headers,
      })
    );
  }

  getActivityById(id: number): Promise<{ actividad: any }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return lastValueFrom(
      this.http.get<{ actividad: any }>(`${this.endpoint}/${id}`, { headers })
    );
  }
  updateActivity(
    id: number,
    data: any
  ): Promise<{ success: boolean; message: string; actividad: any }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.put<{ success: boolean; message: string; actividad: any }>(
        `${this.endpoint}/${id}`,
        data,
        { headers }
      )
    );
  }
  deleteActivity(id: number): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`, // <-- FIXED HERE
    });

    return lastValueFrom(
      this.http.delete<{ success: boolean; message: string }>(
        `${this.endpoint}/${id}`,
        { headers }
      )
    );
  }
}
