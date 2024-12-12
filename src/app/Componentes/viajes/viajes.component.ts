import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Viaje } from '../../Interfaces/viaje';
import { ViajeService } from '../../Services/viaje.service';
import { CommonModule } from '@angular/common';
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
import { ViajeEventService } from '../../Services/viaje-event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViajeDeleteComponent } from '../../Modals/viaje-delete/viaje-delete.component';
pdfMake.addVirtualFileSystem(pdfFonts);

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
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
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private viajeEventService: ViajeEventService,
    private snackBar: MatSnackBar,
  ) {
    this.audioCelebration = new Audio('assets/audio/yippie.mp3');
  }

  ngOnInit(): void {
    this.obtenerViajes();
    this.obtenerAmortizacion();
    this.obtenerUser();
    this.obtenerGastos();
    this.obtenerClientes();
    this.viajeEventService.viajeActualizado$.subscribe(()=>{
      this.obtenerViajes();
      this.cdr.detectChanges();
    })
  }

  obtenerViajes() {
    this.viajeService.getList().subscribe({
      next: (data) => {
        this.viajes = data.filter((viaje) => !viaje.borrado);
      },
      error: (e) => {
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

  BorrarViaje(viaje: Viaje): void {
    this.dialog.open(ViajeDeleteComponent, {
      disableClose: true,
			width: '200px',
      data: viaje
    }).afterClosed().subscribe(result => {
      if (result === "Eliminar") {
        this.viajeService.delete(viaje.idViaje).subscribe({
          next: () => {
            this.viajes = this.viajes.filter((v) => v.idViaje !== viaje.idViaje);
          },
          error: (e) => {
            console.error(e.message);
          },
        });
      }
    })
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
          this.mostrarAlerta("Error al obtener la carta de porte", "X")
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
        this.celebrate();
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
  mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}

  GeneratePDF(viaje) {
    const logoPath = 'assets/img/camion.png'; // Ruta de la imagen

    // Cargar la imagen como base64
    this.loadImageAsBase64(logoPath)
      .then((base64Image) => {

        const gastosFiltrados = this.gastos.filter(
          (gasto) => gasto.viaje === viaje.idViaje
        );

        // Calcular la suma de los gastos filtrados
        const sumaGastos = gastosFiltrados.reduce(
          (total, gasto) => total + Number(gasto.cantidad),
          0
        );

        // Define los datos del usuario si NO existen placeholder
        const userName = this.user ? this.user.razon : 'Nombre del Cliente';
        const userCompany = this.user? this.user.domicilio : 'Empresa del Cliente';
        const userCuit = this.user ? this.user.cuit : 'CUIT del Cliente';
        const userCondition = this.user ? this.user.condicion : 'Condición del Cliente';
        const estado = viaje.facturado ? "Viaje ya facturado" : 'Pendiente a facturar';

        //encontrar al cliente
        const cliente = this.clientes.find(
          (cliente) => cliente.cuitCliente == viaje.cuitUsuario
        );
        const clienteNombre = cliente
          ? cliente.razonSoc
          : 'No se encontró un cliente con ese CUIT.';
        const clienteCuit = cliente
          ? cliente.cuitCliente
          : 'No se encontró el cliente ni su CUIT.';

        // Usar los datos del viaje seleccionado
        const viajeFecha = new Date(viaje.fecha).toLocaleDateString();
        const viajeNumeroRecibo = viaje.idViaje;

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
                            text: `${estado}`,
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
                  ...gastosFiltrados.map((gasto) => [
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
                headerRow: 1,
                widths: ['*','auto'],
                body: [
                  [
                    {
                      text: 'Subtotal del viaje',
                      alignment: 'left',
                      margin: [0, 5, 0, 5],
                    },
                    {
                      text: `${viaje.totalFacturado}`, // Subtotal del viaje
                      alignment: 'right',
                      fillColor: '#f5f5f5',
                      margin: [0, 5, 0, 5],
                    },
                  ],
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
                      text: 'Subtotal ',
                      alignment: 'left',
                      margin: [0, 5, 0, 5],
                    },
                    {
                      text: `${viaje.totalFacturado - sumaGastos}`, // Suma de gastos
                      alignment: 'right',
                      fillColor: '#f5f5f5',
                      margin: [0, 5, 0, 5],
                    },
                  ],
                ],
              },
            },
            {
              text: 'Aclaraciones',
              style: 'notesTitle',
            },
            {
              text: 'Documento no valido como factura', // Notas (por completar)
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
      })
      .catch((err) => {
        console.error('Error al cargar la imagen:', err);
      });
  }

}
