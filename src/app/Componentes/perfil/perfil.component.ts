import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Carga } from '../../Interfaces/carga';
import { CargaService } from '../../Services/carga.service';
import { CargaFormComponent } from '../../Modals/carga-form/carga-form.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteCargaComponent } from '../../Modals/carga-delete/carga-delete.component';
import { CategoriaService } from '../../Services/categoria.service';
import { Categoria } from '../../Interfaces/categoria';
import { CategoriaDeleteComponent } from '../../Modals/categoria-delete/categoria-delete.component';
import { CategoriaFormComponent } from '../../Modals/categoria-form/categoria-form.component';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteFormComponent } from '../../Modals/cliente-form/cliente-form.component';
import { ClienteService } from '../../Services/cliente.service';
import { ClienteDeleteComponent } from '../../Modals/cliente-delete/cliente-delete.component';
import { UserService } from '../../Services/user.service';
import { Usuario } from '../../Interfaces/usuario';
import { UsuarioFormComponent } from '../../Modals/usuario-form/usuario-form.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { ViajeDeleteComponent } from '../../Modals/viaje-delete/viaje-delete.component';
import { Gasto } from '../../Interfaces/gasto';
import { GastosFormComponent } from '../../Modals/gastos-form/gastos-form.component';
import { data } from '@maptiler/sdk';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { Amortizacion } from '../../Interfaces/amortizacion';

@Component({
	selector: 'app-perfil',
	standalone: true,
	imports: [CommonModule, MatDialogModule],
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
	cargas: Carga[] = [];
	categorias: Categoria[] = [];
	clientes: Cliente[] = [];
	user!: Usuario;
	viajes: Viaje[] = [];
	amortizacion: Gasto = {idGasto: 0, nombre: '', categoria: 0,cantidad: 0,viaje:0,borrado:false,fecha: new Date,};
	amortizacionAnual!: Amortizacion;

  constructor(private cargaService: CargaService, private dialog: MatDialog,
              private categoriaService: CategoriaService, private clienteService: ClienteService,
              private userService: UserService,private viajeService: ViajeService,
			  private amortService: AmortizacionService,
			) {
				this.amortizacion.nombre= "Amortizacion";
			}

	ngOnInit(): void {
		this.obtenerUser();
		//this.obtenerCargas();
		this.obtenerCategorias();
		this.obtenerClientes();
		this.obtenerViajes();
		this.getAmort(1);
	}

	obtenerUser() {
		this.userService.get(1).subscribe({
			next: (data) => {
				this.user = data;
				console.log(this.user);
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
				console.log(this.viajes);
			},
			error: (e) => {
				console.error(e);
				console.log(e.message);
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
						console.log("Viaje eliminado");
						this.obtenerViajes();
					},
					error: (e) => {
						console.error(e);
					}
				});
			}
		});
	}

	editarViaje(_t67: Viaje) {
	    throw new Error('Method not implemented.');
    }

	editarUsuario(usuario: Usuario) {
		this.dialog.open(UsuarioFormComponent, {
			disableClose: true,
			width: "400px",
			data: usuario
		}).afterClosed().subscribe(result => {
			if (result === "Editado") {
				//this.obtenerCargas();
				this.obtenerUser();
			}
		});
	}

	darseDeAlta() {
		this.dialog.open(UsuarioFormComponent, {
			disableClose: true,
			width: "400px",
			data: null
		}).afterClosed().subscribe(result => {
			if (result === "Creado") {
				this.obtenerUser();
				this.obtenerCategorias();
				this.obtenerClientes();
			}
		});

		setTimeout(() => {
			this.obtenerUser();
		}, 1500);
	}

//   obtenerCargas() {
//     this.cargaService.getList().subscribe({
//       next: (data) => {
//         this.cargas = data;
//         console.log(this.cargas);
//       },
//       error: (e) => {
//         console.error(e);
//       },
//     });
//   }

//   nuevaCarga() {
//     this.dialog.open(CargaFormComponent, {
//       disableClose: true,
//       width: "400px"
//     }).afterClosed().subscribe(result => {
//       if (result === "Creada") {
//         this.obtenerCargas();
//       }
//     });
//   }

//   editarCarga(carga: Carga) {
//     this.dialog.open(CargaFormComponent, {
//       disableClose: true,
//       width: "400px",
//       data: carga
//     }).afterClosed().subscribe(result => {
//       if (result === "Editad") {
//         this.obtenerCargas();
//       }
//     });
//   }

//   borrarCarga(carga: Carga) {
//     this.dialog.open(DeleteCargaComponent, {
//       disableClose: true,
//       width: "400px",
//       data: carga
//     }).afterClosed().subscribe(result => {
//       if (result === "Eliminar") {
//         this.cargaService.delete(carga.idCarga).subscribe({
//           next: () => {
//             console.log("Carga borrada");
//             this.obtenerCargas();
//           },
//           error: (e) => {
//             console.error(e);
//           }
//         });
//       }
//     });
//   }

	obtenerCategorias() {
		this.categoriaService.getList().subscribe({
			next: (data) => {
				this.categorias = data;
				console.log(this.categorias);
			},
			error: (e) => {
				console.error(e);
			},
		});
	}

	nuevaCategoria() {
		this.dialog.open(CategoriaFormComponent, {
			disableClose: true,
			width: "400px"
		}).afterClosed().subscribe(result => {
			if (result === "Creada") {
				this.obtenerCategorias();
			}
		});
	}

	editarCategoria(categoria: Categoria) {
		this.dialog.open(CategoriaFormComponent, {
			disableClose: true,
			width: "400px",
			data: categoria
		}).afterClosed().subscribe(result => {
			if (result === "Editad") {
				this.obtenerCategorias();
			}
		});
	}

	borrarCategoria(categoria: Categoria) {
		this.dialog.open(CategoriaDeleteComponent, {
			disableClose: true,
			width: "400px",
			data: categoria
		}).afterClosed().subscribe(result => {
		if (result === "Eliminar") {
			this.categoriaService.delete(categoria.idCategoria).subscribe({
				next: () => {
					console.log("Categoría eliminada");
					this.obtenerCategorias();
				},
				error: (e) => {
					console.error(e);
				}
			});
			}
		});
	}

	obtenerClientes() {
		this.clienteService.getList().subscribe({
			next: (data) => {
				this.clientes = data;
				console.log(this.clientes);
			},
			error: (e) => {
				console.error(e);
			},
		});
	}

	nuevoCliente() {
		this.dialog.open(ClienteFormComponent, {
			disableClose: true,
			width: "400px",
			data: null
		}).afterClosed().subscribe(result => {
			if (result && result.action === "Creado") {
				this.clientes.push(result.data);
			}
		});
	}

	editarCliente(cliente: Cliente) {
		this.dialog.open(ClienteFormComponent, {
			disableClose: false,
			width: "300px",
			data: cliente
		}).afterClosed().subscribe(result => {
		if (result && result.action === "Editado") {
			const index = this.clientes.findIndex(c => c.idCliente === result.data.idCliente);

			if (index !== -1) {
			this.clientes[index] = result.data;
			}
		}
		});
	}

	borrarCliente(id: Cliente['idCliente']) {
		this.dialog.open(ClienteDeleteComponent, {
			disableClose: true,
			width: "200px",
			data: id
		}).afterClosed().subscribe(result => {
			if (result === "Eliminar") {
				this.clienteService.delete(id).subscribe({
				next: () => {
						console.log("Cliente eliminado");
						this.obtenerClientes();
					},
					error: (e) => {
						console.error(e);
					}
				});
			}
		});
	}

	Amortizar(viaje: Viaje){
		this.amortizacion.viaje = viaje.idViaje;
		this.amortizacion.fecha = new Date()
		const dialogRef = this.dialog.open(GastosFormComponent, {
			data: this.amortizacion
		});

		dialogRef.afterClosed().subscribe((cantidad:number) => {
			if (cantidad) {
				console.log('Cantidad recibida: ',cantidad);
				
				this.actualizarAmortizacion(this.amortizacion.cantidad);
			}
		});
	}

	getAmort(id:number) {
		this.amortService.get(id).subscribe(data =>{
		  this.amortizacionAnual = data;
		})
	}
	actualizarAmortizacion(cantidad: number) {
		this.amortizacionAnual.recaudado += cantidad;
		this.amortizacionAnual.objetivoAnual -= cantidad;

		this.amortService.update(this.amortizacionAnual, this.amortizacionAnual.idAmortizacion).subscribe({
			next: (data) => {
				console.log('Amortización actualizada exitosamente, recaudado: ', `${data.recaudado}`, " cantidad amortizada restante: ", `${data.objetivoAnual}`);
			},
			error: (e) => {
				console.error('Error al actualizar la amortización', e);
			}
		});
	}
}
