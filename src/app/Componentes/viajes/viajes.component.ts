import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { CommonModule } from '@angular/common';
import { MapComponent } from "../../Modals/map/map.component";
import { NuevoViajeFormComponent } from '../../Modals/nuevo-viaje-form/nuevo-viaje-form.component';
import { MatDialog } from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { Amortizacion } from '../../Interfaces/amortizacion';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [MatCardModule, TotalsCardsComponent, CommonModule, MapComponent,MatProgressBarModule],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css'] 
})
export class ViajesComponent implements OnInit {

  viajes: Viaje[] = [];
  amortizacion?: Amortizacion;
  progreso: number = 0; 
  audioCelebration: HTMLAudioElement;

  constructor(private viajeService: ViajeService, private dialog: MatDialog,
    private amortizacionService: AmortizacionService,
  ) {
    this.audioCelebration = new Audio('assets/audio/yippie.mp3');
   }

  ngOnInit(): void {
    this.obtenerViajes();
    this.obtenerAmortizacion();
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
        next: (blob: Blob) => {
            const url = window.URL.createObjectURL(blob); // Crear una URL para el blob
            const newTab = window.open(url); // Abrir la URL en una nueva pestaña
            if (!newTab) {
                console.error('No se pudo abrir la nueva pestaña. Verifique que no esté bloqueada.');
            }
        },
        error: (err) => {
            console.error('Error al obtener la Carta de Porte', err);
        }
    });
  }

  obtenerAmortizacion(){
    this.amortizacionService.get(1).subscribe(data => {
      this.amortizacion = data;
    })
  }

  calcularPorcentajeAmortizacion(): number {
    if (this.amortizacion) {
      const restanteAnual = this.amortizacion.objetivo - this.amortizacion.recaudado;
      if (restanteAnual <= 0) {
        return 100;
      }
      return (this.amortizacion.recaudado / this.amortizacion.objetivo) * 100.;
    }
    return 0;
  }
  celebrated: boolean = false;
  celebrate() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;
  

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
  
    (function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);
  
      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: (Math.random() * skew) - 0.2 
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4)
      });
  
      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    }());
  
    this.audioCelebration.currentTime = 0; 
    this.audioCelebration.play();
  }
  

}
