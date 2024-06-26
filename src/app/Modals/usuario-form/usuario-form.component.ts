import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Interfaces/usuario';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';

@Component({
	selector: 'app-usuario-form',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './usuario-form.component.html',
	styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  	formUsuario: FormGroup;
	botonAccion: string = "Actualizar";
	dataUsuario: Usuario | null = null;

	constructor(
		private dialogoReferencia: MatDialogRef<UsuarioFormComponent>,
		private fb: FormBuilder,
		private _usuarioServicio: UserService,
		@Inject(MAT_DIALOG_DATA) public data: Usuario | null
	) {
		this.formUsuario = this.fb.group({
		razon: ['', Validators.required],
		domicilio: ['', Validators.required],
		condicion: [''],
		cuit: ['', Validators.required]
		});

		if (data) {
			this.dataUsuario = data;
			this.formUsuario.patchValue(data);
			this.botonAccion = "Actualizar";
		}
	}

	ngOnInit(): void {}

	onSubmit() {
		if (this.formUsuario.valid) {
			
			const usuario: Usuario = {
				idUsuario: this.dataUsuario ? this.dataUsuario.idUsuario : 0,
				razon: this.formUsuario.value.razon,
				domicilio: this.formUsuario.value.domicilio,
				condicion: this.formUsuario.value.condicion,
				cuit: this.formUsuario.value.cuit,
				borrado: false
			};

			if (this.dataUsuario == null) {
				this._usuarioServicio.add(usuario).subscribe({
					next: () => {
						console.log("usuario agregado exitosamente");
						this.dialogoReferencia.close({ action: "Creado", data: usuario });
					},
					error: () => {
						console.error("No se pudo crear el usuario");
					}
				});
			} else {
				this._usuarioServicio.update(usuario, usuario.idUsuario).subscribe({
					next: () => {
						console.log("usuario actualizado correctamente");
						this.dialogoReferencia.close({ action: "Editado", data: usuario });
					},
					error: () => {
						console.error("No se pudo actualizar el usuario");
					}
				});
			}
		}
	}

	onCancel() {
		this.dialogoReferencia.close();
	}
}
