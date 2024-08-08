import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../Services/viaje.service';

@Component({
	selector: 'app-nuevo-viaje-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './nuevo-viaje-form.component.html',
	styleUrl: './nuevo-viaje-form.component.css'
})

export class NuevoViajeFormComponent implements OnInit {
	formViaje: FormGroup;
	tituloAccion: string = "Nuevo";
	botonAccion: string = "Guardar";
	dataViaje: Viaje | null = null;

	constructor(
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: Viaje,
		private fb: FormBuilder,
		private viajeServicio: ViajeService
	) {
		this.formViaje = this.fb.group({
			inicio: ['', Validators.required],
			final: ['', Validators.required],
			distancia: ['', Validators.required],
			gastos: ['', Validators.required],
			fecha: ['', Validators.required],
			cp: ['', Validators.required],
			facturado: ['', Validators.required],
			cuitUsuario: [''],
			borrado: [false]
		});

		if (data) {
			this.dataViaje = data;
		}
	}

	ngOnInit() {
		if (this.dataViaje) {
			this.formViaje.patchValue({
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
		if (this.formViaje.valid) {
			const viaje: Viaje = {
				idViaje: this.dataViaje ? this.dataViaje.idViaje : 0,
				inicio: this.formViaje.value.inicio,
				final: this.formViaje.value.final,
				distancia: this.formViaje.value.distancia,
				gastos: this.formViaje.value.gastos,
				fecha: this.formViaje.value.fecha,
				cp: this.formViaje.value.cp,
				facturado: this.formViaje.value.facturado,
				cuitUsuario: this.formViaje.value.cuitUsuario,
				borrado: this.formViaje.value.borrado
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

	nuevoViaje() {
		this.dialog.open(NuevoViajeFormComponent, {
			disableClose: true,
			width: "400px",
			data: null
		}).afterClosed().subscribe(result => {
			// if (result && result.action === "Creado") {
			// 	this.viajeServicio.push(result.data);
			// }
		});
	  }
	
	onCancel() {
		this.formViaje.reset();
		this.dialog.closeAll();
	}

	mostrarAlerta(mensaje: string) {
		console.log(mensaje);
	}
}
