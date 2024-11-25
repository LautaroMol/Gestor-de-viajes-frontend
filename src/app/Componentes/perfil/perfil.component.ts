import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Carga } from '../../Interfaces/carga';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Categoria } from '../../Interfaces/categoria';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteFormComponent } from '../../Modals/cliente-form/cliente-form.component';
import { ClienteService } from '../../Services/cliente.service';
import { ClienteDeleteComponent } from '../../Modals/cliente-delete/cliente-delete.component';
import { UserService } from '../../Services/user.service';
import { Usuario } from '../../Interfaces/usuario';
import { UsuarioFormComponent } from '../../Modals/usuario-form/usuario-form.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { Gasto } from '../../Interfaces/gasto';
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
	}

	obtenerUser() {
		this.userService.get(1).subscribe({
			next: (data) => {
				this.user = data;
			},
			error: (e) => {
				console.error(e);
			},
		});
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

	borrarCliente(cliente: Cliente) {
		this.dialog.open(ClienteDeleteComponent, {
			disableClose: true,
			width: "200px",
			data: cliente
		}).afterClosed().subscribe(result => {
			if (result === "Eliminar") {
				this.clienteService.delete(cliente.idCliente).subscribe({
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

	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
