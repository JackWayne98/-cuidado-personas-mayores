import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { Iactivity } from '../interfaces/iactivity';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/actividades`;

  createActivity(data: Iactivity): Promise<Iactivity> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`, // no Bearer prefix as you requested
      'Content-Type': 'application/json',
    });
    return lastValueFrom(
      this.http.post<Iactivity>(this.endpoint, data, { headers })
    );
  }
}
