import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs'; 
import { Categoria } from '../Interfaces/categoria'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  private endpoint: string = environment.endpoint;
  private apiUrl: string = this.endpoint + "categoria/";

  constructor(private http: HttpClient) { }

  getList(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}lista`);
  }

  get(idCategoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}${idCategoria}`);
  }  

  add(modelo: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}add`, modelo);
  }

  delete(idCategoria: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}delete/${idCategoria}`);
  }

  update(modelo: Categoria, idCategoria: number): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}update/${idCategoria}`, modelo);
  }
}
