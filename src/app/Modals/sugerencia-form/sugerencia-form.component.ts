import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-sugerencia-form',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatSnackBarModule],
	templateUrl: './sugerencia-form.component.html',
	styleUrl: './sugerencia-form.component.css'
})

export class SugerenciaFormComponent {
	formSugerencia: FormGroup;
	botonAccion: string = "Guardar";
	precioKilometro: number = 0;

	constructor(
		private dialogoReferencia: MatDialogRef<SugerenciaFormComponent>,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: { precioKilometro: number }, 
	) {
		this.precioKilometro = data.precioKilometro;
		this.formSugerencia = this.fb.group({
			monto: [this.precioKilometro, Validators.required],
		});
	}

	ngOnInit(): void {}

	onSubmit() {
		this.mostrarAlerta("Monto Creado Correctamente", "X")
		localStorage.setItem('precioKilometro', JSON.stringify(this.formSugerencia.value.monto)); 
		this.dialogoReferencia.close();
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