import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../Interfaces/user';
import { ResponseAcceso } from '../Interfaces/ResponseAcceso';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl: string = environment.endpoint + 'api/';

  constructor() {
  }

  register(objeto: User): Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Register`,objeto)
  }
  login(objeto: Login): Observable<ResponseAcceso>{
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Acceso/Login`,objeto)
  }

  validarToken(token:string): Observable<ResponseAcceso>{
    return this.http.get<ResponseAcceso>(`${this.baseUrl}Acceso/ValidarToken?token=${token}`)
  }

}
