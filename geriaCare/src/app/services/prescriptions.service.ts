import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/enviroment';
import { IPrescription } from '../interfaces/iprescriptions';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/recetas-medicas`;

  createPrescription(data: IPrescription): Promise<IPrescription> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.http.post<IPrescription>(this.endpoint, data, { headers })
    );
  }
}
