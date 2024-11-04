import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TotalsCardsComponent } from '../totals-cards/totals-cards.component';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../Modals/map/map.component';
import { NuevoViajeFormComponent } from '../../Modals/nuevo-viaje-form/nuevo-viaje-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AmortizacionService } from '../../Services/amortizacion.service';
import { Amortizacion } from '../../Interfaces/amortizacion';
import confetti from 'canvas-confetti';
import { UserService } from '../../Services/user.service';
import { Usuario } from '../../Interfaces/usuario';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteService } from '../../Services/cliente.service';
import { ViajeEventService } from '../../Services/viaje-event.service';


@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [
    MatCardModule,
    TotalsCardsComponent,
    CommonModule,
    MapComponent,
    MatProgressBarModule,
  ],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css'],
})
export class ViajesComponent implements OnInit {
  viajes: Viaje[] = [];
  amortizacion?: Amortizacion;
  progreso: number = 0;
  audioCelebration: HTMLAudioElement;
  pdfjsLib: any;
  user!: Usuario;
  gastos: Gasto[] = [];
  clientes: Cliente[] = [];
  ObjetivoAnualAmort: number = 0;

  constructor(
    private viajeService: ViajeService,
    private dialog: MatDialog,
    private amortizacionService: AmortizacionService,
    private userService: UserService,
    private gastoService: GastoService,
    private clienteService: ClienteService, private viajeEventService: ViajeEventService
  ) {
    this.audioCelebration = new Audio('assets/audio/yippie.mp3');
  }

  ngOnInit(): void {
    this.obtenerViajes();
    this.obtenerAmortizacion();
    this.obtenerUser();
    this.obtenerGastos();
    this.obtenerClientes();
    this.pdfjsLib = this.pdfjsLib;
    this.viajeEventService.viajeActualizado$.subscribe((actualizado) => {
      if (actualizado) {
        this.obtenerViajes();
      }
    });
  }

  obtenerViajes() {
    this.viajeService.getList().subscribe({
      next: (data) => {
        this.viajes = data.filter((viaje) => !viaje.borrado);
        console.log(this.viajes);
      },
      error: (e) => {
        console.log(e.message);
      },
    });
  }

  calcularSubtotal(gastos: (number | null)[] | null): number {
    if (!gastos || gastos.every((g) => g === null)) {
      return 0;
    }
    return gastos
      .filter((g): g is number => g !== null)
      .reduce((total, gasto) => total + gasto, 0);
  }

  BorrarViajes(viaje: Viaje): void {
    this.viajeService.delete(viaje.idViaje).subscribe({
      next: () => {
        this.viajes = this.viajes.filter((v) => v.idViaje !== viaje.idViaje);
      },
      error: (e) => {
        console.error(e);
        console.log(e.message);
      },
    });
  }

  editarViaje(viaje: Viaje) {
    const dialogRef = this.dialog.open(NuevoViajeFormComponent, {
      data: viaje,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerViajes();
    });
  }

  verCartaPorte(cp: string): void {
    this.viajeService.getCartaPorte(cp).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob); // Crear una URL para el blob
        const newTab = window.open(url); // Abrir la URL en una nueva pestaña
        if (!newTab) {
          console.error(
            'No se pudo abrir la nueva pestaña. Verifique que no esté bloqueada.'
          );
        }
      },
      error: (err) => {
        console.error('Error al obtener la Carta de Porte', err);
      },
    });
  }

  obtenerAmortizacion() {
    this.amortizacionService.get(1).subscribe((data) => {
      this.amortizacion = data;
    });
  }

  calcularPorcentajeAmortizacion(): number {
    if (this.amortizacion) {
      const restanteAnual =
        this.amortizacion.objetivo - this.amortizacion.recaudado;
      if (restanteAnual <= 0) {
        return 100;
      }
      return (this.amortizacion.recaudado / this.amortizacion.objetivo) * 100;
    }
    return 0;
  }

  calcularPorcentajeAmortizacionAnual():number{
    if (this.amortizacion) {
      this.ObjetivoAnualAmort = this.amortizacion.objetivo / this.amortizacion.plazo;
      if (this.amortizacion.objetivoAnual <= 0) {
        return 100;
      }
      return ((this.ObjetivoAnualAmort - this.amortizacion.objetivoAnual) / this.ObjetivoAnualAmort) * 100;
    }
    return 0;
  }

  celebrated: boolean = false;
  celebrate() {
    if (this.celebrated) return;

    const duration = 5000;
    this.audioCelebration.currentTime = 0;
    this.audioCelebration.play();

    confetti({
      particleCount: 500,
      spread: 130,
      origin: { y: 0.6 },
      colors: ['#FF0000', '#FFFFFF'],
      gravity: 0.6,
    });

    setTimeout(() => {
      this.celebrated = true;
      confetti.reset();
    }, duration);
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
  obtenerGastos() {
    this.gastoService.getList().subscribe({
      next: (data) => {
        this.gastos = data.filter((gasto) => !gasto.borrado);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(xhr.response);
        } else {
          reject(new Error('Error loading image'));
        }
      };
      xhr.onerror = () => reject(new Error('Error loading image'));
      xhr.send();
    });
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


}
