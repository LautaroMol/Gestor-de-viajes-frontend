import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
	providedIn: 'root'
})

export class UserService {
  	private endpoint: string = environment.endpoint;
	private apiUrl: string = this.endpoint + "usuario/";

  	constructor(private http: HttpClient) { }
	
	getList(): Observable<Usuario[]> {
		return this.http.get<Usuario[]>(`${this.apiUrl}lista`);
	}

	get(idUser: number): Observable<Usuario> {
		return this.http.get<Usuario>(`${this.apiUrl}${idUser}`);
	}  

	add(modelo: Usuario): Observable<Usuario> {
		return this.http.post<Usuario>(`${this.apiUrl}add`, modelo);
	}

	delete(idUser: number): Observable<any> {
		return this.http.delete<any>(`${this.apiUrl}delete/${idUser}`);
	}

	update(modelo: Usuario, idUser: number): Observable<Usuario> {
		return this.http.put<Usuario>(`${this.apiUrl}update/${idUser}`, modelo);
	}
}