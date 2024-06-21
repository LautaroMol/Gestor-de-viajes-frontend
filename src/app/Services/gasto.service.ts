import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Gasto } from '../Interfaces/gasto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  
  private endpoint: string = environment.endpoint;
  private apiUrl: string = this.endpoint + "gasto/";

  constructor(private http: HttpClient) { }

  getList(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}lista`);
  }

  get(idGasto: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}${idGasto}`);
  }  

  add(modelo: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(`${this.apiUrl}add`, modelo);
  }

  delete(gasto: Gasto): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}delete/${gasto.Idgasto}`);
  }

  update(modelo: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.apiUrl}update/${modelo.Idgasto}`, modelo);
  }
}
