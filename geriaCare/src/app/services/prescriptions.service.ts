import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { environment } from "../../environments/enviroment";
import { IPrescription } from "../interfaces/iprescriptions";
import { IprescriptionResponse } from "../interfaces/iprescription-response";

@Injectable({
  providedIn: "root",
})
export class PrescriptionsService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/recetas-medicas`;

  createPrescription(data: IPrescription): Promise<IPrescription> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.post<IPrescription>(this.endpoint, data, { headers })
    );
  }
  getPrescriptionsByElderId(elderId: number): Promise<IprescriptionResponse> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<IprescriptionResponse>(
        `${this.endpoint}/persona-mayor/${elderId}`,
        { headers }
      )
    );
  }
  getPrescriptionById(id: number): Promise<{ receta: IPrescription }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<{ receta: IPrescription }>(`${this.endpoint}/${id}`, {
        headers,
      })
    );
  }

  updatePrescription(
    id: number,
    data: IPrescription
  ): Promise<{ success: boolean; receta: IPrescription }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.put<{ success: boolean; receta: IPrescription }>(
        `${this.endpoint}/${id}`,
        data,
        { headers }
      )
    );
  }

  deletePrescription(id: number): Promise<{ success: boolean }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.delete<{ success: boolean }>(`${this.endpoint}/${id}`, {
        headers,
      })
    );
  }
}
