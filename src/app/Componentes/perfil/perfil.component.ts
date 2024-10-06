import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Carga } from '../../Interfaces/carga';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
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
import { AmortizacionService } from '../../Services/amortizacion.service';
import { Amortizacion } from '../../Interfaces/amortizacion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-perfil',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatSnackBarModule],
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
	cargas: Carga[] = [];
	categorias: Categoria[] = [];
	clientes: Cliente[] = [];
	user!: Usuario;
	viajes: Viaje[] = [];
	amortizacion: Gasto = {idGasto: 0, nombre: '', categoria: 0, cantidad: 0, viaje: 0, borrado: false, fecha: new Date,};
	amortizacionAnual!: Amortizacion;

  constructor(
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
        private clienteService: ClienteService,
        private userService: UserService,private viajeService: ViajeService,
		private amortService: AmortizacionService,
	) {
		this.amortizacion.nombre= "Amortizacion";
	}

	ngOnInit(): void {
		this.obtenerUser();
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
				this.obtenerClientes();
			}
		});

		setTimeout(() => {
			this.obtenerUser();
		}, 1500);
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
				this.actualizarAmortizacion(cantidad);
				viaje.facturado = true;
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
