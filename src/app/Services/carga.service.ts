import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs'; 
import { Carga } from '../Interfaces/carga';

@Injectable({
	providedIn: 'root'
})
export class CargaService {
  
	private endpoint:string = environment.endpoint;
	private apiUrl:string  = this.endpoint +  "carga/";

	constructor(private http:HttpClient) { }

	getList(): Observable<Carga[]> {
		return this.http.get<Carga[]>(`${this.apiUrl}lista`);
	}
	get(IdCarga:number): Observable<Carga[]> {
		return this.http.get<Carga[]>(`${this.apiUrl}${IdCarga}`);
	}  
	add(modelo:Carga):Observable<Carga>{
		return this.http.post<Carga>(`${this.apiUrl}add`,modelo);
	}
	delete(idCarga:number):Observable<Carga>{
		return this.http.delete<Carga>(`${this.apiUrl}delete/${idCarga}`);
	}
	update(modelo:Carga,idCarga:number):Observable<Carga>{
		return this.http.put<Carga>(`${this.apiUrl}update/${idCarga}`,modelo);
	}
}
