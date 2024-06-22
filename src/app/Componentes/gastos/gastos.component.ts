import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule],
  providers: [GastoService,HttpClient],
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
})
export class GastosComponent implements OnInit {
borrarGasto(_t15: Gasto) {
throw new Error('Method not implemented.');
}

editarGasto(_t17: Gasto) {
throw new Error('Method not implemented.');
}
nuevoGasto() {
throw new Error('Method not implemented.');
}

  gastos: Gasto[] = [];
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;

  constructor(private gastoService: GastoService) { }

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
  

}
