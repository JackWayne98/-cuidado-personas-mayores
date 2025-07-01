import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { Idiet } from '../interfaces/idiet';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DietService {
  private http = inject(HttpClient);
  private endpoint = `${environment.apiUrl}/dietas-alimenticias`;

  createDiet(diet: Idiet): Promise<Idiet> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.http.post<Idiet>(this.endpoint, diet, { headers })
    );
  }
}
