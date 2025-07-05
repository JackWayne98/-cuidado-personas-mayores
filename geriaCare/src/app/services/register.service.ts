import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { Iregister } from '../interfaces/iregister';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private httpClient = inject(HttpClient);
  private endpoint: string = `${environment.apiUrl}/usuarios/register`;

  register(data: Iregister): Promise<any> {
    return lastValueFrom(this.httpClient.post(this.endpoint, data));
  }
}
