import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Interfaces/usuario';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-usuario-form',
    standalone: true,
	imports: [CommonModule,ReactiveFormsModule],
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
    formUsuario: FormGroup;
    tituloAccion: string = "Nuevo";
    botonAccion: string = "Darse de alta";
    dataUsuario: Usuario | null = null;

    constructor(
        private dialogoReferencia: MatDialogRef<UsuarioFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Usuario,
        private fb: FormBuilder,
        private _usuarioServicio: UserService,
    ) {
        this.formUsuario = this.fb.group({
            razon: ['', Validators.required],
            domicilio: ['', Validators.required],
            condicion: ['', Validators.required],
            cuit: ['', Validators.required],
            borrado: false
        });

        if (data) {
            this.dataUsuario = data;
        }
    }

    ngOnInit() {
        if (this.dataUsuario) {
            this.formUsuario.patchValue({
                razon: this.dataUsuario.razon,
                domicilio: this.dataUsuario.domicilio,
                condicion: this.dataUsuario.condicion,
                cuit: this.dataUsuario.cuit,
                borrado: false
            });
            this.tituloAccion = "Editar";
            this.botonAccion = "Actualizar";
        }
    }

    onSubmit() {
        if (this.formUsuario.valid) {
            const usuario: Usuario = {
                idUsuario: this.dataUsuario ? this.dataUsuario.idUsuario : 0,
                borrado: false,
                ...this.formUsuario.value
            };

            if (this.dataUsuario === null) {
                // dar de alta
                this._usuarioServicio.add(usuario).subscribe({
                    next: () => {
                        console.log("Usuario agregado exitosamente");
                        this.dialogoReferencia.close({ action: "Creado", data: usuario });
                    },
                    error: (err) => {
                        console.error("Error al agregar usuario:", err);
                    }
                });
            } else {
                // Actualizar usuario existente
                this._usuarioServicio.update(usuario, usuario.idUsuario).subscribe({
                    next: () => {
                        console.log("Usuario actualizado correctamente");
                        this.dialogoReferencia.close({ action: "Editado", data: usuario });
                    },
                    error: (err) => {
                        console.error("Error al actualizar usuario:", err);
                    }
                });
            }
        } else {
            console.error("Formulario inválido. Revise los campos.");
        }
    }

    onCancel() {
        this.dialogoReferencia.close();
    }
}
