import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unidad } from '../Interfaces/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private endpoint: string = environment.endpoint;
  private apiUrl: string = this.endpoint + "unidad/";

  constructor(private http: HttpClient) { }

  getList(): Observable<Unidad[]> {
        return this.http.get<Unidad[]>(`${this.apiUrl}lista`);
  }

  get(idUnidad: number): Observable<Unidad> {
        return this.http.get<Unidad>(`${this.apiUrl}${idUnidad}`);
  }  

  add(modelo: Unidad): Observable<Unidad> {
        return this.http.post<Unidad>(`${this.apiUrl}add`, modelo);
  }

  delete(unidad: Unidad): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}delete/${unidad.idUnidad}`);
  }

  update(modelo: Unidad): Observable<Unidad> {
        return this.http.put<Unidad>(`${this.apiUrl}update/${modelo.idUnidad}`, modelo);
  }
}
