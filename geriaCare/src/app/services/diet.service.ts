import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/enviroment";
import { Idiet } from "../interfaces/idiet";
import { lastValueFrom } from "rxjs";
import { IdietResponse } from "../interfaces/idiet-response";

@Injectable({
  providedIn: "root",
})
export class DietService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/dietas-alimenticias`;

  createDiet(diet: Idiet): Promise<Idiet> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.post<Idiet>(this.endpoint, diet, { headers })
    );
  }
  getDietsByElderId(elderId: number): Promise<IdietResponse> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<IdietResponse>(
        `${this.endpoint}/persona-mayor/${elderId}`,
        {
          headers,
        }
      )
    );
  }
  getDietById(dietId: number): Promise<{ dieta: Idiet }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.get<{ dieta: Idiet }>(`${this.endpoint}/${dietId}`, { headers })
    );
  }

  updateDiet(
    dietId: number,
    diet: Idiet
  ): Promise<{ success: boolean; message: string; dieta: Idiet }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      "Content-Type": "application/json",
    });

    return lastValueFrom(
      this.http.put<{ success: boolean; message: string; dieta: Idiet }>(
        `${this.endpoint}/${dietId}`,
        diet,
        { headers }
      )
    );
  }

  deleteDiet(dietId: number): Promise<{ success: boolean; message: string }> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    return lastValueFrom(
      this.http.delete<{ success: boolean; message: string }>(
        `${this.endpoint}/${dietId}`,
        { headers }
      )
    );
  }
}
