import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { CommonModule } from '@angular/common';
import { MapComponent } from "../../Modals/map/map.component";
import { NuevoViajeFormComponent } from '../../Modals/nuevo-viaje-form/nuevo-viaje-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [MatCardModule, TotalsCardsComponent, CommonModule, MapComponent],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css'] 
})
export class ViajesComponent implements OnInit {

  viajes: Viaje[] = [];
  
  constructor(private viajeService: ViajeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.obtenerViajes();
  }

  obtenerViajes() {
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
  
  calcularSubtotal(gastos: (number | null)[] | null): number {
    if (!gastos || gastos.every(g => g === null)) {
      return 0;
    }
    return gastos.filter((g): g is number => g !== null)
                 .reduce((total, gasto) => total + gasto, 0);
  }
  
  BorrarViajes(viaje: Viaje): void {
    this.viajeService.delete(viaje.idViaje).subscribe({
      next: () => {
        this.viajes = this.viajes.filter(v => v.idViaje !== viaje.idViaje);
      },
      error: (e) => {
        console.error(e);
        console.log(e.message);
      },
    });
  }

  editarViaje(viaje: Viaje) {
    const dialogRef = this.dialog.open(NuevoViajeFormComponent, {
      data: viaje
    });
    dialogRef.afterClosed().subscribe(result => {
        this.obtenerViajes()
    });
  }

  verCartaPorte(cp: string): void {
    this.viajeService.getCartaPorte(cp).subscribe({
        next: (url: string) => {

            const newTab = window.open();
            if (newTab) {
                newTab.location.href = url; // Cambiar a la URL del PDF
            } else {
                console.error('No se pudo abrir la nueva pestaña. Verifique que no esté bloqueada.');
            }
        },
        error: (err) => {
            console.error('Error al obtener la Carta de Porte', err);
        }
    });
}


}
