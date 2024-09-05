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
import { CategoriaService } from '../../Services/categoria.service';

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
	view: [number, number] = [850, 300];
	gastosFiltrados: Gasto[] = [];

	// datos con los que se maneja el gráfico
	single: any[] = [];
	gradient: boolean = true;
	showLegend: boolean = true;
	showLabels: boolean = true;
	isDoughnut: boolean = false;

	constructor(
		private gastoService: GastoService,
		private dialog: MatDialog,
		private viajeService: ViajeService,
		private categoriaService: CategoriaService
	) {}

	ngOnInit(): void {
		this.obtenerGastos();
		this.obtenerViajes();
		this.obtenerCategorias()
	}

	obtenerGastos() {
		this.gastoService.getList().subscribe({
			next: (data) => {
				this.gastos = data.filter(gasto => !gasto.borrado);
				this.filtrarGastosPorViaje();
				this.actualizarGrafico();
			},
			error: (e) => {
				console.error(e);
			},
		});
	}

	obtenerCategorias() {
		this.categoriaService.getList().subscribe({
			next: (data) => {
				this.categorias = data.filter(categoria => !categoria.borrado)
			},
			error: (e) => {
				console.log(e);
			}
		})
	}

	editarGasto(gasto: Gasto) {
		const dialogRef = this.dialog.open(GastosFormComponent, {
			data: gasto
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 'Editado') {
				this.actualizarGrafico();
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
						this.actualizarGrafico();
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
				
				if (this.viajes.length > 0 && this.viajeSeleccionado === null) {
					this.viajeSeleccionado = this.viajes[0].idViaje;
					this.filtrarGastosPorViaje();
					this.actualizarGrafico(); 
				}
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
		
			const diccionarioCategorias = this.categorias.reduce((acc, categoria) => {
				// le asigno el nombre de la categoria a cada id
				acc[categoria.idCategoria] = categoria.nombre;
				return acc;
			}, {});

			// Acumular gastos por categoría
			const categoriaGastos = gastosFiltrados.reduce((acc, gasto) => {
				const nombreCategoria = diccionarioCategorias[gasto.categoria] || `Categoría ${gasto.categoria}`;
				
				if (!acc[nombreCategoria]) {
					acc[nombreCategoria] = 0;
				}
				acc[nombreCategoria] += gasto.cantidad;
				return acc;
			}, {});
			
			// Convertir el objeto a un array para el gráfico
			this.single = Object.keys(categoriaGastos).map(nombreCategoria => ({
				name: nombreCategoria,
				value: categoriaGastos[nombreCategoria],
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
}
