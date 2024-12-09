import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../Services/viaje.service';
import { Viaje } from '../../Interfaces/viaje';
import { CommonModule } from '@angular/common';
import { Amortizacion } from '../../Interfaces/amortizacion';
import { Gasto } from '../../Interfaces/gasto';
import { ViajeDeleteComponent } from '../../Modals/viaje-delete/viaje-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { GastosFormComponent } from '../../Modals/gastos-form/gastos-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';

@Component({
  	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule,DragDropModule,ResizableModule, TotalsCardsComponent],
  	templateUrl: './dashboard.component.html',
  	styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  	amortizacion: Gasto = {
		idGasto: 0,
		nombre: '',
		categoria: 0,
		cantidad: 0,
		viaje: 0,
		borrado: false,
		fecha: new Date
	};
	amortizacionAnual!: Amortizacion;
  viajes: Viaje[] = [];
  flagAmort: boolean = true;


	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private amortService: AmortizacionService,
		private viajeService: ViajeService
	){}

	ngOnInit(): void {
		this.obtenerViajes();
    this.obtenerAmort();
	}
  obtenerAmort(){
    this.amortService.getList().subscribe({
      next: (data) => {
        this.amortizacionAnual = data[0];
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  	obtenerViajes(){
		this.viajeService.getList().subscribe({
			next: (data) => {
				this.viajes = data;
			},
			error: (e) => {
				console.error(e);
			},
		});
	}

  	borrarViaje(viaje: Viaje) {
		this.dialog.open(ViajeDeleteComponent, {
			disableClose: true,
			width: "400px",
			data: viaje
		}).afterClosed().subscribe(result => {
			if (result === "Eliminar") {
				this.viajeService.delete(viaje.idViaje).subscribe({
					next: () => {
						this.obtenerViajes();
					},
					error: (e) => {
						console.error(e);
					}
				});
			}
		});
	}

	Facturar(viaje: Viaje){
		viaje.facturado = true;
		this.actualizarViaje(viaje);

		this.snackBar.open("Viaje facturado", "X", {
			duration: 2000,
		});
	}

 	Amortizar(viaje: Viaje){
    if(this.amortizacionAnual == null){
      this.mostrarAlerta("Debe cargar una amortizacion","X")
      return;
    }
    this.amortizacion.fecha = new Date();
    this.amortizacion.fecha.setHours(0, 0, 0, 0);

    this.amortizacion.nombre = "Amortizacion"
		this.amortizacion.viaje = viaje.idViaje;


		const dialogRef = this.dialog.open(GastosFormComponent, {
			data: {
        gasto: this.amortizacion
        ,flagAmort:true }
		});

		dialogRef.afterClosed().subscribe((cantidad:number) => {
			if (cantidad) {
				this.actualizarAmortizacion(cantidad);
				viaje.amortizado = true;
				this.actualizarViaje(viaje);
			}
		});
	}

	getAmort(id:number) {
		this.amortService.get(id).subscribe(data =>{
		  	this.amortizacionAnual = data;
		})
	}

	actualizarAmortizacion(cantidad: number) {
		if(this.amortizacionAnual.objetivoAnual< cantidad){
			const dif = cantidad - this.amortizacionAnual.objetivoAnual;

			this.amortizacionAnual.recaudado += cantidad;

			this.amortizacionAnual.periodo +=1;
			this.amortizacionAnual.objetivoAnual = this.amortizacionAnual.objetivo / this.amortizacionAnual.plazo;
			this.amortizacionAnual.objetivoAnual -= dif;

			this.amortService.update(this.amortizacionAnual, this.amortizacionAnual.idAmortizacion).subscribe({
				next: (data) => {
					console.log('Amortización actualizada exitosamente, recaudado: ', `${data.recaudado}`, " cantidad amortizada restante: ", `${data.objetivoAnual}`);
				},
				error: (e) => {
					this.mostrarAlerta('Error al actualizar la amortización', "X");
				}
			});
		}
		else {
			this.amortizacionAnual.recaudado += cantidad;
			this.amortizacionAnual.objetivoAnual -= cantidad;

			this.amortService.update(this.amortizacionAnual, this.amortizacionAnual.idAmortizacion).subscribe({
				next: (data) => {
					console.log('Amortización actualizada exitosamente, recaudado: ', `${data.recaudado}`, " cantidad amortizada restante: ", `${data.objetivoAnual}`);
				},
				error: (e) => {
					this.mostrarAlerta('Error al actualizar la amortización', "X");
				}
			});
		}
	}

  	actualizarViaje(viaje: Viaje) {
		this.viajeService.update(viaje, viaje.idViaje).subscribe({
			next: () => {
				this.mostrarAlerta("Viaje Facturado", "X");
			},
			error: (e) => {
				this.mostrarAlerta("Error al actualizar el viaje", e);
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
