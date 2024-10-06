import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from '../../Interfaces/categoria';
import { CategoriaService } from '../../Services/categoria.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-categoria-form',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatDialogModule,ReactiveFormsModule, MatSnackBarModule],
	templateUrl: './categoria-form.component.html',
	styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
	formCategoria: FormGroup;
	tituloAccion: string = "Nueva";
	botonAccion: string = "Guardar";
	dataCategoria: Categoria | null = null;

	constructor(
		private snackBar: MatSnackBar,
		private dialogoReferencia: MatDialogRef<CategoriaFormComponent>,
		private fb: FormBuilder,
		private _categoriaServicio: CategoriaService,
		@Inject(MAT_DIALOG_DATA) public data: Categoria | null
	) {
		this.formCategoria = this.fb.group({
			nombre: ['', Validators.required],
			borrado: [false]
		});

		if (data) {
			this.dataCategoria = data;
			this.formCategoria.patchValue(data);
			this.tituloAccion = "Editar";
			this.botonAccion = "Actualizar";
		}
	}

	ngOnInit(): void {}

	onSubmit() {
		if (this.formCategoria.valid) {
			const categoria: Categoria = {
				idCategoria: this.dataCategoria ? this.dataCategoria.idCategoria : 0,
				...this.formCategoria.value
			};

			if (this.dataCategoria == null) {
				this._categoriaServicio.add(categoria).subscribe({
					next: () => {
						this.mostrarAlerta("Categoría creada exitosamente", "X");
						this.dialogoReferencia.close("Creada");
					},
					error: () => {
						this.mostrarAlerta("No se pudo crear la categoría", "X");
						// console.error("No se pudo crear la categoría");
					}
				});
			} else {
				this._categoriaServicio.update(categoria,categoria.idCategoria).subscribe({
					next: () => {
						this.mostrarAlerta("Categoría actualizada correctamente", "X");
						//console.log("Categoría actualizada correctamente");
						this.dialogoReferencia.close("Editada");
					},
					error: () => {
						this.mostrarAlerta("No se pudo actualizar la categoría", "X");
						// console.error("No se pudo actualizar la categoría");
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
