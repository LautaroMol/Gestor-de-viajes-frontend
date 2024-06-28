import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GastosFormComponent } from '../../Modals/gastos-form/gastos-form.component';
import { DeleteGastoComponent } from '../../Modals/gastos-delete/gastos-delete.component';
import { Categoria } from '../../Interfaces/categoria';
import { CategoriaService } from '../../Services/categoria.service';
import { CategoriaDeleteComponent } from '../../Modals/categoria-delete/categoria-delete.component';
import { CategoriaFormComponent } from '../../Modals/categoria-form/categoria-form.component';

@Component({
	selector: 'app-gastos',
	standalone: true,
	imports: [CommonModule, MatDialogModule],
	providers: [GastoService, HttpClient],
	templateUrl: './gastos.component.html',
	styleUrls: ['./gastos.component.css'],
})
export class GastosComponent implements OnInit {
	gastos: Gasto[] = [];
	categorias: Categoria[] = [];
	mostrarFormulario: boolean = false;
	modoEdicion: boolean = false;

	constructor(private gastoService: GastoService, private dialog: MatDialog,
		private categoriaService: CategoriaService,
	) { }

	ngOnInit(): void {
		this.obtenerGastos();
		this.obtenerCategorias();
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
 	obtenerCategorias() {
		this.categoriaService.getList().subscribe({
			next: (data) => {
				this.categorias = data;
				console.log(this.categorias);
			},
			error: (e) => {
				console.error(e);
			}
		});
	}

	nuevaCategoria() {
		this.dialog.open(CategoriaFormComponent, {
			disableClose: true,
			width: '400px',
			data: null
		}).afterClosed().subscribe(result => {
			if (result && result.action === 'Creado') {
				this.categorias.push(result.data);
			}
			this.obtenerCategorias();
		});
	}

	editarCategoria(categoria: Categoria) {
		this.dialog.open(CategoriaFormComponent, {
			disableClose: false,
			width: '300px',
			data: categoria
		}).afterClosed().subscribe(result => {
			if (result && result.action === 'Editado') {
				const index = this.categorias.findIndex(c => c.idCategoria === result.data.idCategoria);
				if (index !== -1) {
					this.categorias[index] = result.data;
				}
			}
			this.obtenerCategorias();
		});
	}

	borrarCategoria(id: Categoria['idCategoria']) {
		this.dialog.open(CategoriaDeleteComponent, {
			disableClose: true,
			width: '200px',
			data: id
		}).afterClosed().subscribe(result => {
			if (result === 'Eliminar') {
				this.categoriaService.delete(id).subscribe({
				next: () => {
						console.log('Categoría eliminada');
						this.obtenerCategorias();
					},
					error: (e) => {
						console.error(e);
					}
				});
			}
		});
	}
}
