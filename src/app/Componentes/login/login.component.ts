import { Component, inject, OnInit } from '@angular/core';
import { AccesoService } from '../../Services/acceso.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../Interfaces/login';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../Interfaces/user';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule,CommonModule],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	private accesoService = inject(AccesoService);
	private router = inject(Router);
	public formBuild = inject(FormBuilder);

	public formLogin: FormGroup = this.formBuild.group({
		correo: ['', Validators.required],
		clave: ['', Validators.required]
	});

	constructor (
		private snackBar: MatSnackBar,
	) {}

	public usuarioExistente: User | null = null;

	ngOnInit() {
		this.accesoService.getUser().subscribe({
			next: (user) => {
				this.usuarioExistente = user;
			},
			error: () => {
				this.usuarioExistente = null;
		}
		});
	}

	iniciarSesion() {
		if (this.formLogin.invalid) return;

		const obj: Login = {
			correo: this.formLogin.value.correo,
			pass: this.formLogin.value.clave
		};

		this.accesoService.login(obj).subscribe({
			next: (data) => {
				if (data.isSuccess) {
				localStorage.setItem("token", data.token);
				this.router.navigate(['viajes']);
				} else {
					this.mostrarAlerta("Credenciales Incorrectas", "X")
				}
			},
			error: (e) => {
				this.mostrarAlerta("Error al iniciar sesión", "X")
			}
		});
	}

	registrarse() {
		this.router.navigate(['registro']);
	}

	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
