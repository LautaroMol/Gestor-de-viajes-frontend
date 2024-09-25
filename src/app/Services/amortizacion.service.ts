import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs'; 
import { Amortizacion } from '../Interfaces/amortizacion';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionService {
  private endpoint: string = environment.endpoint;
  private apiUrl: string = this.endpoint + "amortizacion/";

  constructor(private http: HttpClient) { }

  getList(): Observable<Amortizacion[]> {
		return this.http.get<Amortizacion[]>(`${this.apiUrl}lista`);
	}

	get(idAmortizacion: number): Observable<Amortizacion> {
		return this.http.get<Amortizacion>(`${this.apiUrl}${idAmortizacion}`);
	}  

	add(modelo: Amortizacion): Observable<Amortizacion> {
		return this.http.post<Amortizacion>(`${this.apiUrl}add`, modelo);
	}

	delete(idAmortizacion: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}delete/${idAmortizacion}`);
	}

	update(modelo: Amortizacion, idAmortizacion: number): Observable<Amortizacion> {
		return this.http.put<Amortizacion>(`${this.apiUrl}update/${idAmortizacion}`, modelo);
	}
}
