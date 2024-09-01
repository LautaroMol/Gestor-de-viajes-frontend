import { Component, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { CommonModule } from '@angular/common';
import { MapComponent } from "../../Modals/map/map.component";

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [MatCardModule, TotalsCardsComponent, CommonModule, MapComponent],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css'
})
export class ViajesComponent implements OnInit {

  viajes: Viaje[] = [];

  constructor(private viajeService: ViajeService,
    
  ) { }
  ngOnInit(): void {
    this.obtenerViajes();
    
  }

  obtenerViajes(){
    this.viajeService.getList().subscribe({
      next: (data) => {
        this.viajes = data.filter(viaje => !viaje.borrado);
        console.log(this.viajes);
      },
      error: (e) => {
        console.error(e);
        console.log(e.message);
      },
    });
  }
  
  calcularSubtotal(gastos: number[]): number {
    return gastos.reduce((total, gasto) => total + gasto, 0);
  }

  BorrarViajes(viaje: Viaje): void {
    this.viajeService.delete(viaje.idViaje).subscribe({
      next: () => {
        this.viajes = this.viajes.filter(v => v.idViaje!== viaje.idViaje);
      },
      error: (e) => {
        console.error(e);
        console.log(e.message);
      },
    });
  }

  editarViaje(viaje: Viaje) {
    throw new Error('Method not implemented.');
  }

}
