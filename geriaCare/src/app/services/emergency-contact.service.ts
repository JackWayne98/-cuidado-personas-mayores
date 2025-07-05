import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { IemergencyContact } from "../interfaces/iemergency-contact";
import { IemergencyResponse } from "../interfaces/iemergency-response";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EmergencyContactService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/contactos-emergencia`;

  createEmergencyContact(
    contact: IemergencyContact
  ): Promise<IemergencyContact> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.post<IemergencyContact>(this.endpoint, contact, { headers })
    );
  }

  getEmergencyContactsByElderId(elderId: number): Promise<IemergencyResponse> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<IemergencyResponse>(
        `${this.endpoint}/persona-mayor/${elderId}`,
        { headers }
      )
    );
  }

  getEmergencyContactById(
    contactId: number
  ): Promise<{ contacto: IemergencyContact }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<{ contacto: IemergencyContact }>(
        `${this.endpoint}/${contactId}`,
        { headers }
      )
    );
  }

  updateEmergencyContact(
    contactId: number,
    contact: IemergencyContact
  ): Promise<IemergencyContact> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.put<IemergencyContact>(
        `${this.endpoint}/${contactId}`,
        contact,
        { headers }
      )
    );
  }

  deleteEmergencyContact(contactId: number): Promise<void> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.delete<void>(`${this.endpoint}/${contactId}`, { headers })
    );
  }
}
