import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { IloginResponse } from '../interfaces/ilogin-response';
import { lastValueFrom } from 'rxjs';
import { Iuser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private endpoint: string = `${environment.apiUrl}/usuarios/login`;
  private userEndpoint: string = `${environment.apiUrl}/usuarios`;

  login(email: string, password: string): Promise<IloginResponse> {
    const body = { email, password };
    return lastValueFrom(
      this.httpClient.post<IloginResponse>(this.endpoint, body)
    );
  }
  getUserById(id: number): Promise<{ user: Iuser }> {
    return lastValueFrom(
      this.httpClient.get<{ user: Iuser }>(`${this.userEndpoint}/${id}`)
    );
  }
}
