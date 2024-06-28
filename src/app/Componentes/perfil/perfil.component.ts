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

  constructor(private cargaService: CargaService, private dialog: MatDialog,
              private categoriaService: CategoriaService, private clienteService: ClienteService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.obtenerCargas();
    this.obtenerCategorias();
    this.obtenerClientes();
    this.obtenerUser();
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

  editarUsuario(usuario: Usuario) {
    this.dialog.open(UsuarioFormComponent, {
      disableClose: true,
      width: "400px",
      data: usuario
    }).afterClosed().subscribe(result => {
      if (result === "Editada") {
        this.obtenerCargas();
      }
    });
    this.obtenerUser();
  }

  darseDeAlta() {
    this.dialog.open(UsuarioFormComponent, {
      disableClose: true,
      width: "400px",
      data: null
    }).afterClosed().subscribe(result => {
      if (result === "Creado") {
        this.obtenerUser();
      }
    });
  }

  obtenerCargas() {
    this.cargaService.getList().subscribe({
      next: (data) => {
        this.cargas = data;
        console.log(this.cargas);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  nuevaCarga() {
    this.dialog.open(CargaFormComponent, {
      disableClose: true,
      width: "400px"
    }).afterClosed().subscribe(result => {
      if (result === "Creada") {
        this.obtenerCargas();
      }
    });
  }

  editarCarga(carga: Carga) {
    this.dialog.open(CargaFormComponent, {
      disableClose: true,
      width: "400px",
      data: carga
    }).afterClosed().subscribe(result => {
      if (result === "Editada") {
        this.obtenerCargas();
      }
    });
  }

  borrarCarga(carga: Carga) {
    this.dialog.open(DeleteCargaComponent, {
      disableClose: true,
      width: "400px",
      data: carga
    }).afterClosed().subscribe(result => {
      if (result === "Eliminar") {
        this.cargaService.delete(carga.idCarga).subscribe({
          next: () => {
            console.log("Carga borrada");
            this.obtenerCargas();
          },
          error: (e) => {
            console.error(e);
          }
        });
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
      if (result === "Editada") {
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


}
