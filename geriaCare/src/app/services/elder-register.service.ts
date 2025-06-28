import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { Ielder } from '../interfaces/ielder';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElderRegisterService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/personas-mayores`;

  registerElder(data: Ielder): Promise<Ielder> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.http.post<Ielder>(this.endpoint, data, { headers })
    );
  }

  getAllElders(): Promise<{ personasMayores: Ielder[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });

    // The HTTP call should expect the API’s response shape:
    return lastValueFrom(
      this.http.get<{ personasMayores: Ielder[] }>(this.endpoint, { headers })
    );
  }
}
