import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteService } from '../../Services/cliente.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-cliente-form',
	standalone: true,
	templateUrl: './cliente-form.component.html',
	styleUrls: ['./cliente-form.component.css'],
	imports: [ReactiveFormsModule, MatSnackBarModule]
})

export class ClienteFormComponent implements OnInit {
	formCliente: FormGroup;
	botonAccion: string = "Guardar";
	dataCliente: Cliente | null = null;

	constructor(
		private dialogoReferencia: MatDialogRef<ClienteFormComponent>,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private _clienteServicio: ClienteService,
		@Inject(MAT_DIALOG_DATA) public data: Cliente | null
	) {
		this.formCliente = this.fb.group({
		razonSoc: ['', Validators.required],
		domicilio: ['', Validators.required],
		condicion: [''],
		cuitCliente: ['', Validators.required]
		});
		
		if (data) {
			this.dataCliente = data;
			this.formCliente.patchValue(data);
			this.botonAccion = "Actualizar";
		}
	}

	ngOnInit(): void {}

	onSubmit() {
		if (this.formCliente.valid) {
			
			const cliente: Cliente = {
				idCliente: this.dataCliente ? this.dataCliente.idCliente : 0,
				razonSoc: this.formCliente.value.razonSoc,
				domicilio: this.formCliente.value.domicilio,
				condicion: this.formCliente.value.condicion,
				cuitCliente: String(this.formCliente.value.cuitCliente),
				borrado: false
			};
			

			if (this.dataCliente == null) {
				this._clienteServicio.add(cliente).subscribe({
					next: () => {
						this.mostrarAlerta("Cliente agregado exitosamente", "X");
						this.dialogoReferencia.close({ action: "Creado", data: cliente });
					},
					error: () => {
						this.mostrarAlerta("No se pudo crear el cliente", "X");
						console.log(cliente);
					}
				});
			} else {
				console.log(cliente.idCliente);
				this._clienteServicio.update(cliente, cliente.idCliente).subscribe({
					next: () => {
						this.mostrarAlerta("Cliente actualizado correctamente", "X");
						// console.log("Cliente actualizado correctamente");
						this.dialogoReferencia.close({ action: "Editado", data: cliente });
					},
					error: () => {
						this.mostrarAlerta("No se pudo actualizar el cliente", "X");
						// console.error("No se pudo actualizar el cliente");
					}
				});
			}
		}
	}

	onCancel() {
		this.dialogoReferencia.close();
	}

	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
