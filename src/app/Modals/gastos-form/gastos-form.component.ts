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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-gastos-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
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
  flagAmort: boolean = false;

	constructor(
		private dialogoReferencia: MatDialogRef<GastosFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: {gasto: Gasto; flagAmort: boolean},
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
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
			this.dataGasto = data.gasto;
      this.flagAmort = data.flagAmort;
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
        fecha: this.dataGasto.fecha || new Date().toISOString().split('T')[0],
        borrado: false
      });

      if (this.dataGasto.nombre != "Amortizacion") {
        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar";
      }
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
			if (this.dataGasto == null || gasto.nombre == "Amortizacion") {
        if (gasto.nombre == "Amortizacion" && !this.flagAmort){
          this.mostrarAlerta("No esta amortizando de la manera correcta, no puede ingresar ese nombre", "X");
          return;
        }
				this.gastoService.add(gasto).subscribe({
					next: (data) => {
						const nuevoGastoId = data.idGasto;
						this.viajeService.get(gasto.viaje).subscribe({
							next: (data) => {
                                this.viajeElej = data;
                                if (gasto.cantidad>this.viajeElej.totalFacturado){
                                    this.mostrarAlerta("El monto es mayor a lo facturado en el viaje", "X");
                                    return;
                                }
                                this.asignarGastoAlViaje(nuevoGastoId, gasto.viaje,gasto);
                            },
                            error: (e) => {
                                this.mostrarAlerta("No se ha podido agregar el gasto en el viaje", "X");
                            }
                        });
					},
					error: (e) => {
						this.mostrarAlerta("No se ha podido crear el gasto", "X");
					}
				});
			} else {
				// camino por editar
				this.viajeService.get(gasto.viaje).subscribe({
					next: (data) => {
						this.viajeElej = data;
						if (gasto.cantidad>this.viajeElej.totalFacturado && this.formGasto.value.categoria=="Amortizacion"){
                            this.mostrarAlerta("La cantidad a amortizar es mayor a la facturada con el viaje", "X");
                            return;
                        }
						this.gastoService.update(gasto).subscribe({
							next: (data) => {
								this.mostrarAlerta("Gasto editado correctamente", "X");
								this.dialogoReferencia.close("Editado");
							},
							error: (e) => {
								this.mostrarAlerta("No se ha podido editar el gasto", "X");
							}
						});
					}, error: (e) => {this.mostrarAlerta("Error al obtener el viaje", "X");
					}
				});
			}
		}
	}


	obtenerViajes(){
		this.viajeService.getList().subscribe({
			next: (data) => {
				this.viajes = data.filter(viaje => !viaje.borrado)
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

	asignarGastoAlViaje(gastoId: number, viajeId: number,gasto: Gasto) {
		// Obtén el viaje y actualiza el array de gastos
		this.viajeService.get(viajeId).subscribe({
			next: (viaje) => {
				// Añade el gasto al arreglo
				viaje.gastos.push(gastoId);

				// Actualizar el viaje con el nuevo arreglo
				this.viajeService.update(viaje, viajeId).subscribe({
					next: () => {
						this.mostrarAlerta("Gasto asignado correctamente al viaje", "X");
						if (gasto.nombre == "Amortizacion"){
							this.dialogoReferencia.close(gasto.cantidad);
						}else this.dialogoReferencia.close("Creado");
					},
					error: (e) => {
						this.mostrarAlerta("Error al asignar el gasto al viaje", "X");
					}
				});
			},
			error: (e) => {
				this.mostrarAlerta("Error al obtener el viaje", "X");
			}
		});
	}

	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
