import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GastosFormComponent } from '../../Modals/gastos-form/gastos-form.component';
import { DeleteGastoComponent } from '../../Modals/gastos-delete/gastos-delete.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { Categoria } from '../../Interfaces/categoria';

@Component({
	selector: 'app-gastos',
	standalone: true,
	imports: [CommonModule, MatDialogModule, NgxChartsModule],
	providers: [GastoService, HttpClient],
	templateUrl: './gastos.component.html',
	styleUrls: ['./gastos.component.css'],
})
export class GastosComponent implements OnInit {
	gastos: Gasto[] = [];
	viajes: Viaje[] = [];
	categorias: Categoria[] = [];
	categoriaSeleccionada: Categoria | null = null;
	viajeSeleccionado: number | null = null;
	mostrarFormulario: boolean = false;
	modoEdicion: boolean = false;
	view: [number, number] = [700, 400];
	gastosFiltrados: Gasto[] = [];

	// datos con los que se maneja el gráfico
	single: any[] = [];
	// options
	gradient: boolean = true;
	showLegend: boolean = true;
	showLabels: boolean = true;
	isDoughnut: boolean = false;

	constructor(
		private gastoService: GastoService,
		private dialog: MatDialog,
		private viajeService: ViajeService,
	) {}

	ngOnInit(): void {
		this.obtenerGastos();
		this.obtenerViajes();
	}

	obtenerGastos() {
		this.gastoService.getList().subscribe({
			next: (data) => {
				this.gastos = data;
				this.filtrarGastosPorViaje();
				this.actualizarGrafico();
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

	obtenerViajes() {
		this.viajeService.getList().subscribe({
			next: (data) => {
				this.viajes = data.filter(viaje => !viaje.borrado);
				console.log(this.viajes);
			},
			error: (e) => {
				console.error(e);
			},
		});
	}

	onViajeChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		this.viajeSeleccionado = Number(selectElement.value);
		this.filtrarGastosPorViaje();
		this.actualizarGrafico();
	}

	filtrarGastosPorViaje() {
		if (this.viajeSeleccionado !== null) {
			this.gastosFiltrados = this.gastos.filter(gasto => gasto.viaje === this.viajeSeleccionado);
		} else {
			this.gastosFiltrados = [];
		}
	}

	actualizarGrafico() {
		if (this.viajeSeleccionado !== null) {
			const gastosFiltrados = this.gastos.filter(gasto => gasto.viaje === this.viajeSeleccionado);

			// Acumular gastos por categoría
			const categoriaGastos = gastosFiltrados.reduce((acc, gasto) => {
				const categoria = gasto.categoria;
				if (!acc[categoria]) {
					acc[categoria] = 0;
				}
				acc[categoria] += gasto.cantidad;
				return acc;
			}, {});

			// Convertir el objeto a un array para el gráfico
			this.single = Object.keys(categoriaGastos).map(categoria => ({
				name: `Categoría ${categoria}`,
				value: categoriaGastos[categoria],
			}));
		}
	}

	// Aquí se maneja el evento al clickear en el grafico.
	onSelect(data: any): void {
		// Extraer el idCategoria del nombre de la categoría seleccionada
		const idCategoria = Number(data.name.split(' ')[1]);
		this.filtrarGastosPorCategoria(idCategoria);
	}

	// Filtrar los gastos por la categoría seleccionada y el viaje seleccionado
	filtrarGastosPorCategoria(idCategoria: number) {
		this.gastosFiltrados = this.gastos.filter(
			gasto => gasto.viaje === this.viajeSeleccionado && gasto.categoria === idCategoria
		);
	}

	onActivate(data: any): void {
		console.log('Activate', JSON.parse(JSON.stringify(data)));
	}

	onDeactivate(data: any): void {
		console.log('Deactivate', JSON.parse(JSON.stringify(data)));
	}
}
