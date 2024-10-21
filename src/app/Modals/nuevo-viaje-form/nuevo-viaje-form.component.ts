import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../Services/viaje.service';
import { MapComponent } from '../map/map.component';
import { GeocodingService } from '../../Services/geocoding.service';
import { UnidadService } from '../../Services/unidad.service';
import { Unidad } from '../../Interfaces/unidad';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-nuevo-viaje-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MapComponent, MatDialogModule,MatSnackBarModule],
    templateUrl: './nuevo-viaje-form.component.html',
    styleUrls: ['./nuevo-viaje-form.component.css']
})
export class NuevoViajeFormComponent implements OnInit {
    @ViewChild(MapComponent) mapComponent!: MapComponent;
    cpUrl: string | null = null;
    selectedFile: File | null = null;
    formViaje: FormGroup;
    tituloAccion: string = "Nuevo";
    botonAccion: string = "Guardar";
    dataViaje: Viaje | null = null;
    unidad!: Unidad;
    montoSugerido: number = 0;
    totalFacturado: number = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Viaje | null,
        private dialog: MatDialogRef<NuevoViajeFormComponent>,
        private fb: FormBuilder,
		private snackBar: MatSnackBar,
        private viajeServicio: ViajeService,
        private geocodingService: GeocodingService,
        private unidadService: UnidadService
    ) {
        this.formViaje = this.fb.group({
            inicio: ['', Validators.required],
            final: ['', Validators.required],
            distancia: ['', Validators.required],
            gastos: this.fb.array([]),
            fecha: ['', Validators.required],
            cp: [''],
            facturado: [false],
            cuitUsuario: [''],
            totalFacturado: 0,
            borrado: [false]
        });

        if (data) {
            this.dataViaje = data;
            this.formViaje.patchValue(data);
            this.tituloAccion = "Editado";
        }
    }

    ngOnInit() {
        this.getCamion(1);
        if (this.dataViaje) {
            this.getCamion(1);
            this.formViaje.patchValue({
                inicio: this.dataViaje.inicio,
                final: this.dataViaje.final,
                distancia: this.dataViaje.distancia,
                gastos: this.dataViaje.gastos,
                fecha: this.dataViaje.fecha,
                cp: this.dataViaje.cp,
                facturado: this.dataViaje.facturado,
                cuitUsuario: this.dataViaje.cuitUsuario,
                borrado: false
            });
            setTimeout(() => {
                this.mapComponent.clearMap();
                this.geocodingService.forwardGeocode(this.dataViaje?.inicio ?? '').subscribe((result) => {
                    if (result && result.length > 0) {
                        const startCoords: [number, number] = [result[0].lat, result[0].lon];
                        this.geocodingService.forwardGeocode(this.dataViaje?.final ?? '').subscribe((result) => {
                            if (result && result.length > 0) {
                                const endCoords: [number, number] = [result[0].lat, result[0].lon];
                                this.centrarMapa(startCoords, endCoords);
                                this.mapComponent.addStartMarker(startCoords);
                                this.mapComponent.addEndMarker(endCoords);
                            }
                        });
                    }
                });
            }, 1500);
            this.tituloAccion = "Editado";
            this.botonAccion = "Actualizar";
        }
    }
    calcularTotalFacturado() {
        const distancia = this.formViaje.value.distancia || 0;
        const precioReal = parseFloat((document.getElementById('monto') as HTMLInputElement).value) || 0;

        if (distancia && precioReal) {
            this.totalFacturado = distancia * precioReal;
            this.formViaje.patchValue({ totalFacturado: this.totalFacturado });
        }
    }

    onSubmit() {
        if (this.formViaje.valid) {
            const viajeData = {
                idViaje: this.dataViaje ? this.dataViaje.idViaje : 0,
                inicio: this.formViaje.value.inicio,
                final: this.formViaje.value.final,
                distancia: this.formViaje.value.distancia,
                gastos: this.formViaje.value.gastos,
                fecha: this.formViaje.value.fecha,
                cp: '', 
                facturado: this.formViaje.value.facturado,
                cuitUsuario: this.formViaje.value.cuitUsuario,
                totalFacturado: this.totalFacturado,
                borrado: this.formViaje.value.borrado
            };
    
            if (this.unidad && this.unidad.kmAceite != null) {
                this.unidad.kmAceite += viajeData.distancia;
            } else {
                console.error('kmAceite no está inicializado o no es válido');
            }
    
            if (this.unidad && this.unidad.estadoRueda && Array.isArray(this.unidad.estadoRueda)) {
                this.unidad.estadoRueda = this.unidad.estadoRueda.map(rueda => rueda + viajeData.distancia);
            } else {
                console.error('estadoRueda no es un array o no está inicializado');
            }
    
            // Si es un nuevo viaje
            if (this.dataViaje == null) {
                // Actualizar la unidad con los nuevos valores
                this.unidadService.update(this.unidad).subscribe({
                    next: (data) => {
                        console.log("Camión actualizado correctamente:", data);
                    },
                    error: (e) => {
                        console.error("No se ha podido actualizar el camión", e);
                    }
                });
    
                // Guardar el nuevo viaje
                this.viajeServicio.addViaje(viajeData).subscribe({
                    next: (data) => {
                		this.mostrarAlerta("Viaje Creado Correctamente", "X")
                        const viajeId = data.viajeId;
    
                        if (this.selectedFile) {
                            const formData = new FormData();
                            formData.append('archivo', this.selectedFile, this.selectedFile.name);
    
                            this.viajeServicio.addArchivo(viajeId, formData).subscribe({
                                next: (archivoData) => {
                                    console.log("Archivo guardado correctamente:", archivoData);
                                    this.dialog.close(true);
                                },
                                error: (err) => {
                                    console.error("Error al guardar el archivo:", err);
                                }
                            });
                        } else {
                            this.dialog.close(true);
                        }
                    },
                    error: (err) => {
                		this.mostrarAlerta("Error al crear el viaje", "X")
                    }
                });
    
            } else { 
                this.unidadService.update(this.unidad).subscribe({
                    next: (data) => {
                        console.log("Camión actualizado correctamente:", data);
                    },
                    error: (e) => {
                        console.error("No se ha podido actualizar el camión", e);
                    }
                });
    
                // Actualizar el viaje existente
                this.viajeServicio.update(viajeData, viajeData.idViaje).subscribe({
                    next: (data) => {
                        // console.log("Viaje actualizado correctamente:", data);
	                	this.mostrarAlerta("Viaje Actualizado correctamente", "X")
    
                        // Si hay un archivo seleccionado, lo subimos
                        if (this.selectedFile != null) {
                            const formData = new FormData();
                            formData.append('archivo', this.selectedFile, this.selectedFile.name);
    
                            this.viajeServicio.addArchivo(viajeData.idViaje, formData).subscribe({
                                next: (archivoData) => {
                                    console.log("Archivo guardado correctamente:", archivoData);
                                    this.dialog.close(true);
                                },
                                error: (err) => {
                                    console.error("Error al guardar el archivo:", err);
                                }
                            });
                        } else {
                            this.dialog.close(true);
                        }
                    },
                    error: (err) => {
                		this.mostrarAlerta("Error al actualizar el viaje", "X")
                    }
                });
            }
        } else {
    		this.mostrarAlerta("Formulario Invalido", "X")
        }
    }

    onLocationSelected(coords: [number, number]) {
        this.geocodingService.reverseGeocode(coords[0], coords[1]).subscribe((data) => {
            const direccionCompleta = data.display_name;
            const direccionSimplificada = this.simplificarDireccion(direccionCompleta);
            this.formViaje.patchValue({ inicio: direccionSimplificada });
        });
    }
    
    onDestinationSelected(coords: [number, number]) {
        this.geocodingService.reverseGeocode(coords[0], coords[1]).subscribe((data) => {
            const direccionCompleta = data.display_name;
            const direccionSimplificada = this.simplificarDireccion(direccionCompleta);
            this.formViaje.patchValue({ final: direccionSimplificada });
        });
    }
    
    onDistanceCalculated(distance: number) {
        this.formViaje.patchValue({
            distancia: parseFloat(distance.toFixed(2))
        });
        
        this.calcularPrecioSugerido(distance);
    }

    onCancel() {
        this.formViaje.reset();
        this.dialog.close();
    }

    centrarMapa(startCoords: [number, number], endCoords: [number, number]) {
        this.mapComponent.clearMap();
		
		if (this.mapComponent) {

			if (!isNaN(startCoords[0]) && !isNaN(startCoords[1]) &&
				!isNaN(endCoords[0]) && !isNaN(endCoords[1])) {
				this.mapComponent.setMapView(startCoords);
				this.mapComponent.setMapView(endCoords);
				this.mapComponent.addMarker(startCoords, 'Inicio del viaje');
				this.mapComponent.addMarker(endCoords, 'Fin del viaje');
				this.mapComponent.calculaRuta(startCoords, endCoords);
			} else {
				console.error('Invalid coordinates for setMapView:', startCoords, endCoords);
			}
		}
	}

    simplificarDireccion(direccion: string): string {
        const partes = direccion.split(',');
        return partes.slice(0, 4).join(',');
    }

    getCamion(id: number): void {
        this.unidadService.get(id).subscribe(data => {
            this.unidad = data;
        });
    }

    getFile(event: Event) {
        const target = event.target as HTMLInputElement;
        const files: FileList | null = target.files;

        if (files && files.length > 0) {
            this.selectedFile = files[0];
        } else {
            this.selectedFile = null;
        }
    }
    
    calcularPrecioSugerido(distancia : number ) {
        const monto = localStorage.getItem("precioKilometro")
		this.montoSugerido = Number(distancia * Number(monto));
	}

	mostrarAlerta(msg: string, accion: string) {
		this.snackBar.open( msg, accion, {
			verticalPosition:"bottom",
			horizontalPosition:"center",
			duration: 3000
		});
	}
}
