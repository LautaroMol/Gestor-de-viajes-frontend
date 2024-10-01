import { Component } from '@angular/core';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { GastoService } from '../../Services/gasto.service';
import { Gasto } from '../../Interfaces/gasto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-totals-cards',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './totals-cards.component.html',
  styleUrl: './totals-cards.component.css'
})
export class TotalsCardsComponent {
  	viajes: Viaje[] = [];
	gastos: Gasto[] = [];
	gastosTotales: number = 0;

	constructor(
		private viajeService: ViajeService,
		private gastoService: GastoService,
	){}

	ngOnInit(): void {
		this.obtenerViajes();
		this.obtenerGastos();
	}
	
	obtenerViajes() {
		this.viajeService.getList().subscribe({
		  next: (data) => {
			this.viajes = data.filter((viaje) => !viaje.borrado);
		  },
		  error: (e) => {
			console.log(e.message);
		  },
		});
	}
	
	obtenerGastos() {
		this.gastoService.getList().subscribe({
		  next: (data) => {
			this.gastos = data.filter( gasto => !gasto.borrado);
			this.gastosTotales = this.gastos.reduce((acc, gasto) => acc + gasto.cantidad, 0);
		  },
		  error: (e) => {
			console.log(e.message);
		  },
		});
	}
}
