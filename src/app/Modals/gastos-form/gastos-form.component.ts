import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Interfaces/categoria';

@Component({
	selector: 'app-gastos-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './gastos-form.component.html',
	styleUrls: ['./gastos-form.component.css']
})
export class GastosFormComponent implements OnInit {
	formGasto: FormGroup;
	tituloAccion: string = "Nuevo";
	botonAccion: string = "Guardar";
	dataGasto: Gasto | null = null;
	categorias: Categoria[] = [];

	constructor(
		private dialogoReferencia: MatDialogRef<GastosFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Gasto,
		private fb: FormBuilder,
		private _gastoServicio: GastoService,
		private categoriaService: CategoriaService
	) {
		this.formGasto = this.fb.group({
			nombre: ['', Validators.required],
			cantidad: ['', Validators.required],
			categoria: ['', Validators.required],
			viaje: ['', Validators.required],
			fecha: ['', Validators.required],
			borrado: [false]
		});

		if (data) {
			this.dataGasto = data;
		}
	}

	ngOnInit() {
		this.obtenerCategorias();
		if (this.dataGasto) {
			this.formGasto.patchValue({
				nombre: this.dataGasto.nombre,
				cantidad: this.dataGasto.cantidad,
				categoria: this.dataGasto.categoria,
				viaje: this.dataGasto.viaje,
				fecha: this.dataGasto.fecha,
				borrado: false
			});
			this.tituloAccion = "Editar";
			this.botonAccion = "Actualizar";
		}
	}

	onSubmit() {
		if (this.formGasto.valid) {
			const gasto: Gasto = {
				idGasto: this.dataGasto ? this.dataGasto.idGasto : 0,
				nombre: this.formGasto.value.nombre,
				cantidad: this.formGasto.value.cantidad,
				categoria: this.formGasto.value.categoria,
				viaje: this.formGasto.value.viaje,
				fecha: this.formGasto.value.fecha,
				borrado: this.formGasto.value.borrado
			};

			if (this.dataGasto == null) {
				this._gastoServicio.add(gasto).subscribe({
					next: (data) => {
						this.mostrarAlerta("Gasto cargado al sistema exitosamente");
						this.dialogoReferencia.close("Creado");
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido crear el gasto");
					}
				});
			} else {
				this._gastoServicio.update(gasto).subscribe({
					next: (data) => {
						this.mostrarAlerta("Gasto editado correctamente");
						this.dialogoReferencia.close("Editado");
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido editar el gasto");
					}
				});
			}
		}
	}

	onCancel() {
		this.formGasto.reset();
		this.dialogoReferencia.close();
	}

	mostrarAlerta(mensaje: string) {
		console.log(mensaje);
	}
	obtenerCategorias() {
		this.categoriaService.getList().subscribe({
			next: (data) => {
				this.categorias = data.filter( categoria => 
					categoria.borrado === false
				);
				console.log(this.categorias);
			},
			error: (e) => {
				console.error(e);
			}
		});
	}
}
