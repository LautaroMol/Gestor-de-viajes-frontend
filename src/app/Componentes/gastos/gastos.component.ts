import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GastosFormComponent } from '../../Modals/gastos-form/gastos-form.component';
import { DeleteGastoComponent } from '../../Modals/gastos-delete/gastos-delete.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
	selector: 'app-gastos',
	standalone: true,
	imports: [CommonModule, MatDialogModule, NgxChartsModule, BrowserAnimationsModule],
	providers: [GastoService, HttpClient],
	templateUrl: './gastos.component.html',
	styleUrls: ['./gastos.component.css'],
})
export class GastosComponent implements OnInit {
	gastos: Gasto[] = [];
	mostrarFormulario: boolean = false;
	modoEdicion: boolean = false;
	view: [number, number] = [700, 400];

	single = [
		{
		  "name": "Germany",
		  "value": 8940000
		},
		{
		  "name": "USA",
		  "value": 5000000
		},
		{
		  "name": "France",
		  "value": 7200000
		},
		  {
		  "name": "UK",
		  "value": 6200000
		}
	];
	// options
	gradient: boolean = true;
	showLegend: boolean = true;
	showLabels: boolean = true;
	isDoughnut: boolean = false;

	constructor(
		private gastoService: GastoService,
		private dialog: MatDialog
	)
	{
		// Object.assign(this, { single });
	}

	ngOnInit(): void {
		this.obtenerGastos();
	}

 	obtenerGastos() {
		this.gastoService.getList().subscribe({
			next: (data) => {
				this.gastos = data;
				console.log(this.gastos);
			},
			error: (e) => {
				console.error(e);
			},
		});
 	}

	editarGasto(gasto: Gasto) {
		const dialogRef = this.dialog.open(GastosFormComponent, {
			data: gasto
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 'Editado') {
				this.obtenerGastos();
			}
		});
	}

	borrarGasto(gasto: Gasto) {
		const dialogRef = this.dialog.open(DeleteGastoComponent, {
			disableClose: true,
			width: "400px",
			data: gasto
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === "Eliminar") {
				this.gastoService.delete(gasto).subscribe({
					next: (data) => {
						console.log("Gasto borrado exitosamente");
						this.obtenerGastos();
					},
					error: (e) => {
						console.error("No se ha podido borrar el gasto", e);
					}
				});
			}
		});
	}

	nuevoGasto() {
		const dialogRef = this.dialog.open(GastosFormComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result === 'Creado') {
				this.obtenerGastos();
			}
		});
	}
 
	onSelect(data: any): void {
		console.log('Item clicked', JSON.parse(JSON.stringify(data)));
	}

	onActivate(data: any): void {
		console.log('Activate', JSON.parse(JSON.stringify(data)));
	}

	onDeactivate(data: any): void {
		console.log('Deactivate', JSON.parse(JSON.stringify(data)));
	}
}
