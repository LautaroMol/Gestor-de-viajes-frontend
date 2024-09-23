import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Interfaces/categoria';
import { CategoriaFormComponent } from '../../Modals/categoria-form/categoria-form.component';
import { CategoriaDeleteComponent } from '../../Modals/categoria-delete/categoria-delete.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SugerenciaFormComponent } from '../../Modals/sugerencia-form/sugerencia-form.component';

@Component({
	selector: 'app-configuracion',
	standalone: true,
	imports: [CommonModule, MatDialogModule],
	providers: [CategoriaService, HttpClient],
	templateUrl: './configuracion.component.html',
	styleUrl: './configuracion.component.css'
})


export class ConfiguracionComponent {
	categorias: Categoria[] = [];
	mostrarFormulario: boolean = false;
	modoEdicion: boolean = false;
	precioKilometro: number | null = 0;

	constructor(private dialog: MatDialog,
		private categoriaService: CategoriaService,
	) { }

	ngOnInit(): void {
		this.obtenerCategorias();
		this.obtenerMonto();
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

	obtenerMonto() {
		const monto = localStorage.getItem('precioKilometro');
		this.precioKilometro = monto ? Number(monto) : 0;
	}

	nuevoMonto() {
		const monto = localStorage.getItem('precioKilometro');
		const precioKilometro = monto ? Number(monto) : 0;
	
		this.dialog.open(SugerenciaFormComponent, {
			disableClose: false,
			width: '300px',
			data: { precioKilometro }
		}).afterClosed().subscribe(result => {
			this.obtenerMonto(); 
		});
	}
}