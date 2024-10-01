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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from '../../Services/user.service';
import { Usuario } from '../../Interfaces/usuario';
import { Gasto } from '../../Interfaces/gasto';
import { GastoService } from '../../Services/gasto.service';
import { Cliente } from '../../Interfaces/cliente';
import { ClienteService } from '../../Services/cliente.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  constructor(
    private viajeService: ViajeService,
    private dialog: MatDialog,
    private amortizacionService: AmortizacionService,
    private userService: UserService, private gastoService: GastoService,
    private clienteService: ClienteService
  ) {
    this.audioCelebration = new Audio('assets/audio/yippie.mp3');
  }

  ngOnInit(): void {
    this.obtenerViajes();
    this.obtenerAmortizacion();
    this.obtenerUser();
    this.obtenerGastos();
    this.obtenerClientes();
    this.pdfjsLib = this.pdfjsLib
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
            this.gastos = data.filter(gasto =>
                !gasto.borrado);
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

  GeneratePDF(viaje) {
    const logoPath = 'assets/img/camion.png'; // Ruta de la imagen

    // Cargar la imagen como base64
    this.loadImageAsBase64(logoPath).then((base64Image) => {
        console.log('Imagen cargada correctamente:', base64Image); // Verifica que la imagen esté en base64

        // Define los datos del usuario si NO existen placeholder
        const userName = this.user ? this.user.razon : 'Nombre del Cliente';
        const userCompany = this.user ? this.user.domicilio : 'Compañía del Cliente';
        const userCuit = this.user ? this.user.cuit : 'CUIT del Cliente';
        const userCondition = this.user ? this.user.condicion : 'Condición del Cliente';
        this.gastos.includes(viaje.gastos);
        //encontrar al cliente
        const cliente = this.clientes.find(cliente => cliente.cuitCliente == viaje.cuitUsuario);
        const clienteNombre = cliente ? cliente.razonSoc : "No se encontró el cliente ni su CUIT en la base de datos, por favor cárguelo y verifique que no se haya borrado.";
        const clienteCuit = cliente ? cliente.cuitCliente : "No se encontró el cliente ni su CUIT.";

        // Usar los datos del viaje seleccionado
        const viajeFecha = new Date(viaje.fecha).toLocaleDateString();
        const viajeNumeroRecibo = viaje.idViaje;
        const sumaGastos = this.gastos.reduce((total, gasto) => total + gasto.cantidad,0);

        const dd = {
            content: [
                {
                    columns: [
                        {
                            image: base64Image,
                            width: 150,
                        },
                        [
                            {
                                text: 'Recibo de viaje',
                                color: '#333333',
                                width: '*',
                                fontSize: 28,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 0, 0, 15],
                            },
                            {
                                stack: [
                                    {
                                        columns: [
                                            {
                                                text: `Numero de recibo:  `,
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: viajeNumeroRecibo, // Número de recibo
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Fecha del viaje: ',
                                                color: '#aaaaab',
                                                bold: true,
                                                width: '*',
                                                fontSize: 12,
                                                alignment: 'right',
                                            },
                                            {
                                                text: viajeFecha, 
                                                bold: true,
                                                color: '#333333',
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: 100,
                                            },
                                        ],
                                    },
                                    {
                                        columns: [
                                            {
                                                text: 'Estado',
                                                color: '#aaaaab',
                                                bold: true,
                                                fontSize: 12,
                                                alignment: 'right',
                                                width: '*',
                                            },
                                            {
                                                text: 'PAID', // Estado del pago
                                                bold: true,
                                                fontSize: 14,
                                                alignment: 'right',
                                                color: 'green',
                                                width: 100,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    ],
                },
                {
                    columns: [
                        {
                            text: 'Del usuario',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 14,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                        {
                            text: 'Para el cliente',
                            color: '#aaaaab',
                            bold: true,
                            fontSize: 14,
                            alignment: 'left',
                            margin: [0, 20, 0, 5],
                        },
                    ],
                },
                {
                    columns: [
                        {
                            text: `Nombre: ${userName} \n Cuit ${userCuit}`,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                        },
                        {
                            text: `${clienteNombre} \n CUIT: ${clienteCuit}`,
                            bold: true,
                            color: '#333333',
                            alignment: 'left',
                        },
                    ],
                },
                {
                    columns: [
                        {
                            text: 'Desde',
                            color: '#aaaaab',
                            bold: true,
                            margin: [0, 7, 0, 3],
                        },
                        {
                            text: 'Hasta',
                            color: '#aaaaab',
                            bold: true,
                            margin: [0, 7, 0, 3],
                        },
                    ],
                },
                {
                    columns: [
                        {
                            text: `${viaje.inicio}`,
                            style: 'invoiceBillingAddress',
                        },
                        {
                            text: `${viaje.final}`,
                            style: 'invoiceBillingAddress',
                        },
                    ],
                },
                {
                    text: `Número de viaje: ${viaje.idViaje}`,
                    bold: true,
                    margin: [0, 10, 0, 10],
                    fontSize: 15,
                    alignment: 'center',
                },
                {
                  layout: {
                      defaultBorder: false,
                      hLineWidth: () => 1,
                      vLineWidth: () => 1,
                      hLineColor: () => '#eaeaea',
                      vLineColor: () => '#eaeaea',
                      paddingLeft: () => 10,
                      paddingRight: () => 10,
                      paddingTop: () => 2,
                      paddingBottom: () => 2,
                  },
                  table: {
                      headerRows: 1,
                      widths: ['*', 80], // Primer columna flexible, segunda columna fija en 80px
                      body: [
                          [
                              {
                                  text: 'DESCRIPCIÓN DEL ÍTEM',
                                  fillColor: '#eaf2f5',
                                  margin: [0, 5, 0, 5],
                                  textTransform: 'uppercase',
                              },
                              {
                                  text: 'TOTAL DEL ÍTEM',
                                  alignment: 'right',
                                  fillColor: '#eaf2f5',
                                  margin: [0, 5, 0, 5],
                                  textTransform: 'uppercase',
                              },
                          ],

                          ...this.gastos.map(gasto => [
                              {
                                  text: gasto.nombre, 
                                  margin: [0, 5, 0, 5], 
                              },
                              {
                                  text: `${gasto.cantidad}`,
                                  alignment: 'right',
                                  margin: [0, 5, 0, 5],
                              },
                          ]),
                      ],
                  },
              },
              {
                  layout: {
                      defaultBorder: false,
                      hLineWidth: () => 1,
                      vLineWidth: () => 1,
                      hLineColor: () => '#eaeaea',
                      vLineColor: () => '#eaeaea',
                      paddingLeft: () => 10,
                      paddingRight: () => 10,
                      paddingTop: () => 3,
                      paddingBottom: () => 3,
                  },
                  table: {
                      headerRows: 1,
                      widths: ['*', 'auto'],
                      body: [
                          [
                              {
                                  text: 'Subtotal del Pago',
                                  alignment: 'right',
                                  margin: [0, 5, 0, 5],
                              },
                              {
                                  text: `${sumaGastos}`, // Subtotal del viaje
                                  alignment: 'right',
                                  fillColor: '#f5f5f5',
                                  margin: [0, 5, 0, 5],
                              },
                          ],
                      ],
                  },
                },
                {
                    text: 'NOTAS',
                    style: 'notesTitle',
                },
                {
                    text: 'Algunas notas aquí \n Segunda línea de notas', // Notas (por completar)
                    style: 'notesText',
                },
            ],
            styles: {
                notesTitle: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 50, 0, 3],
                },
                notesText: {
                    fontSize: 10,
                },
            },
            defaultStyle: {
                columnGap: 20,
            },
        };

        // Crear y abrir el PDF
        const pdf = pdfMake.createPdf(dd);
        pdf.open();
        this.obtenerGastos();
    }).catch(err => {
        console.error('Error al cargar la imagen:', err);
    });
  }


}