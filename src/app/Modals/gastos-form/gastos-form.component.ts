import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Interfaces/categoria';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';

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
	viajes: Viaje[] = [];
	viajeElej!: Viaje;

	constructor(
		private dialogoReferencia: MatDialogRef<GastosFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: Gasto,
		private fb: FormBuilder,
		private gastoService: GastoService,
		private viajeService: ViajeService,
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
		this.obtenerViajes();
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
	
			// camino por nuevo gasto
			if (this.dataGasto == null) {
				this.gastoService.add(gasto).subscribe({
					next: (data) => {
						const nuevoGastoId = data.idGasto; // El ID del gasto recién creado
						this.asignarGastoAlViaje(nuevoGastoId, gasto.viaje);
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido crear el gasto");
					}
				});
			} else {
				// camino por editar
				this.viajeService.get(gasto.viaje).subscribe({
					next: (data) => {
						this.viajeElej = data;
					}
				});
				if (gasto.cantidad> this.viajeElej.totalFacturado){
					alert("La cnatidad a amortizar es mayor a la facturada con el viaje");
					return;
				}else{
					this.gastoService.update(gasto).subscribe({
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
	}
	

	obtenerViajes(){
		this.viajeService.getList().subscribe({
			next: (data) => {
				this.viajes = data.filter(viaje => !viaje.borrado)
				console.log(this.viajes);
			},
			error: (e) => {
				console.log(e.message);
			}
		});
	}

	obtenerCategorias() {
		this.categoriaService.getList().subscribe({
			next: (data) => {
				this.categorias = data.filter( categoria => 
					categoria.borrado === false
				);
			},
			error: (e) => {
				console.error(e);
			}
		});
	}

	onCancel() {
		this.formGasto.reset();
		this.dialogoReferencia.close();
	}

	mostrarAlerta(mensaje: string) {
		console.log(mensaje);
	}
	asignarGastoAlViaje(gastoId: number, viajeId: number) {
		// Obtén el viaje y actualiza el array de gastos
		this.viajeService.get(viajeId).subscribe({
			next: (viaje) => {
				// Añade el gasto al arreglo
				viaje.gastos.push(gastoId);
	
				// Actualizar el viaje con el nuevo arreglo
				this.viajeService.update(viaje, viajeId).subscribe({
					next: () => {
						this.mostrarAlerta("Gasto asignado correctamente al viaje");
						this.dialogoReferencia.close("Creado");
					},
					error: (e) => {
						this.mostrarAlerta("Error al asignar el gasto al viaje");
					}
				});
			},
			error: (e) => {
				this.mostrarAlerta("Error al obtener el viaje");
			}
		});
	}
}
