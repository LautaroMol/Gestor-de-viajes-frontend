import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../Services/viaje.service';
import { MapComponent } from '../map/map.component';

@Component({
	selector: 'app-editar-viaje-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MapComponent,MatDialogModule],
	templateUrl: './editar-viaje-form.component.html',
	styleUrl: './editar-viaje-form.component.css'
})

export class EditarViajeFormComponent implements OnInit {
    formViajeEditar: FormGroup;
    tituloAccion: string = "Nuevo";
    botonAccion: string = "Guardar";
    dataViaje: Viaje | null = null;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: Viaje | null,
		private dialog: MatDialog,
		private fb: FormBuilder,
		private viajeServicio: ViajeService,
	) {
		this.formViajeEditar = this.fb.group({
			inicio: ['', Validators.required],
			final: ['', Validators.required],
			distancia: ['', Validators.required],
			gastos: [null],
			fecha: ['', Validators.required],
			cp: ['', Validators.required],
			facturado: ['', Validators.required],
			cuitUsuario: [''],
			borrado: [false]
		});

		if (data) {
			this.dataViaje = data;
			this.formViajeEditar.patchValue(data);
			this.tituloAccion = "Editar";
		}
	}

	ngOnInit() {
		if (this.dataViaje) {
			this.formViajeEditar.patchValue({
				inicio: this.dataViaje.inicio,
				final: this.dataViaje.final,
				distancia: this.dataViaje.distancia,
				gastos: this.dataViaje.gastos,
				fecha: this.dataViaje.fecha,
				cp: this.dataViaje.cp,
				facturado: this.dataViaje.facturado,
				cuitUsuatio: this.dataViaje.cuitUsuario,
				borrado: false
			});
			this.tituloAccion = "Editar";
			this.botonAccion = "Actualizar";
		}
	}

	onSubmit() {
		if (this.formViajeEditar.valid) {
			const viaje: Viaje = {
				idViaje: this.dataViaje ? this.dataViaje.idViaje : 0,
				inicio: this.formViajeEditar.value.inicio,
				final: this.formViajeEditar.value.final,
				distancia: this.formViajeEditar.value.distancia,
				gastos: this.formViajeEditar.value.gastos,
				fecha: this.formViajeEditar.value.fecha,
				cp: this.formViajeEditar.value.cp,
				facturado: this.formViajeEditar.value.facturado,
				cuitUsuario: this.formViajeEditar.value.cuitUsuario,
				borrado: this.formViajeEditar.value.borrado
			};

			if (this.dataViaje == null) {
				this.viajeServicio.add(viaje).subscribe({
					next: (data) => {
						this.mostrarAlerta("Viaje cargado al sistema exitosamente");
						this.dialog.closeAll();
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido crear el Viaje");
					}
				});
			} else {
				this.viajeServicio.update(viaje, viaje.idViaje).subscribe({
					next: (data) => {
						this.mostrarAlerta("Viaje editado correctamente");
						this.dialog.closeAll();
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido editar el Viaje");
					}
				});
			}
		}
	}

	onLocationSelected(coords: [number, number]) {
		this.formViajeEditar.patchValue({
			inicio: coords.join(', ') 
		});
	}

	onDestinationSelected(coords: [number, number]) {
		this.formViajeEditar.patchValue({
			final: coords.join(', ')
		});
	}
	
	onDistanceCalculated(distance: number) {
		this.formViajeEditar.patchValue({
			distancia: `${distance.toFixed(2)} Km`
		});
	}

	onCancel() {
		this.formViajeEditar.reset();
		this.dialog.closeAll();
	}

	mostrarAlerta(mensaje: string) {
		console.log(mensaje);
	}
}