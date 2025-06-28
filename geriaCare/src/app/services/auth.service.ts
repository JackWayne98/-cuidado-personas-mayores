import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { IloginResponse } from '../interfaces/ilogin-response';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private endpoint: string = `${environment.apiUrl}/usuarios/login`;

  login(email: string, password: string): Promise<IloginResponse> {
    const body = { email, password };
    return lastValueFrom(
      this.httpClient.post<IloginResponse>(this.endpoint, body)
    );
  }
}
