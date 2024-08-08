import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/enviorment';
import { Observable } from 'rxjs';
import { Viaje } from '../Interfaces/viaje';

@Injectable({
	providedIn: 'root'
})
export class ViajeService {
	private endpoint: string = environment.endpoint;
	private apiUrl: string = this.endpoint + "viaje/";

  	constructor(private http: HttpClient) { }
	
	getList(): Observable<Viaje[]> {
		return this.http.get<Viaje[]>(`${this.apiUrl}lista`);
	}

	get(idViaje: number): Observable<Viaje> {
		return this.http.get<Viaje>(`${this.apiUrl}${idViaje}`);
	}  

	add(modelo: Viaje): Observable<Viaje> {
		return this.http.post<Viaje>(`${this.apiUrl}add`, modelo);
	}

	delete(idViaje: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}delete/${idViaje}`);
	}

	update(modelo: Viaje, idViaje: number): Observable<Viaje> {
		return this.http.put<Viaje>(`${this.apiUrl}update/${idViaje}`, modelo);
	}
}
