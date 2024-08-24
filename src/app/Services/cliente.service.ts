import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs'; 
import { Cliente } from '../Interfaces/cliente';


@Injectable({
	providedIn: 'root'
})
export class ClienteService {

	private endpoint: string = environment.endpoint;
	private apiUrl: string = this.endpoint + "cliente/";

	constructor(private http: HttpClient) { }

	getList(): Observable<Cliente[]> {
		return this.http.get<Cliente[]>(`${this.apiUrl}lista`);
	}

	get(idCliente: number): Observable<Cliente> {
		return this.http.get<Cliente>(`${this.apiUrl}${idCliente}`);
	}  

	add(modelo: Cliente): Observable<Cliente> {
		return this.http.post<Cliente>(`${this.apiUrl}add`, modelo);
	}

	delete(idCliente: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}delete/${idCliente}`);
	}

	update(modelo: Cliente, idCliente: number): Observable<Cliente> {
		return this.http.put<Cliente>(`${this.apiUrl}update/${idCliente}`, modelo);
	}
}
