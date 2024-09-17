import { Component, OnInit, Inject, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Viaje } from '../../Interfaces/viaje';
import { CommonModule } from '@angular/common';
import { ViajeService } from '../../Services/viaje.service';
import { MapComponent } from '../map/map.component';
import { PlacesService } from '../../Services/place.service';
import { GeocodingService } from '../../Services/geocoding.service';
import { ViajesComponent } from '../../Componentes/viajes/viajes.component';
import { UnidadService } from '../../Services/unidad.service';
import { Unidad } from '../../Interfaces/unidad';
import { error } from 'console';

@Component({
    selector: 'app-nuevo-viaje-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MapComponent, MatDialogModule],
    templateUrl: './nuevo-viaje-form.component.html',
    styleUrls: ['./nuevo-viaje-form.component.css']
})
export class NuevoViajeFormComponent implements OnInit {
	@ViewChild(MapComponent) mapComponent!: MapComponent;
    formViaje: FormGroup;
    tituloAccion: string = "Nuevo";
    botonAccion: string = "Guardar";
    dataViaje: Viaje | null = null;
    unidad!: Unidad;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Viaje | null,
        private dialog: MatDialogRef<NuevoViajeFormComponent>,
        private fb: FormBuilder,
        private viajeServicio: ViajeService,
        private placeSvc: PlacesService,
        private geocodingService: GeocodingService,
        private unidadService: UnidadService
    ) {
        this.formViaje = this.fb.group({
            inicio: ['', Validators.required],
            final: ['', Validators.required],
            distancia: ['', Validators.required],
            gastos: this.fb.array([]),
            fecha: ['', Validators.required],
            cp: [0,Validators.required],
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
            this.unidad.kmAceite -= this.dataViaje.distancia;
            this.unidad.estadoRueda.forEach(rueda => {
                if (this.dataViaje)
                rueda -= this.dataViaje.distancia;
            });
            setTimeout(() => {
                this.mapComponent.clearMap();
            this.geocodingService.forwardGeocode(this.dataViaje?.inicio ?? '').subscribe((result) => {
				console.log('Result for start location:', result);
				if (result && result.length > 0) {
					const startCoords: [number, number] = [result[0].lat, result[0].lon];
					console.log('Start Coordinates:', startCoords);
					this.geocodingService.forwardGeocode(this.dataViaje?.final ?? '').subscribe((result) => {
						console.log('Result for end location:', result);
						if (result && result.length > 0) {
							const endCoords: [number, number] = [result[0].lat, result[0].lon];
							console.log('End Coordinates:', endCoords);
							this.centrarMapa(startCoords, endCoords);
                            this.mapComponent.addStartMarker(startCoords);
                            this.mapComponent.addEndMarker(endCoords);
						} else {
							console.error('No results for end location');
						}
					});
				} else {
					console.error('No results for start location');
				}
                
			});
            }, 1500);       
            this.tituloAccion = "Editado";
            this.botonAccion = "Actualizar";
        }
    }

    onSubmit() {
        if (this.formViaje.valid) {
            const viaje: Viaje = {
                idViaje: this.dataViaje ? this.dataViaje.idViaje : 0,
                inicio: this.formViaje.value.inicio,
                final: this.formViaje.value.final,
                distancia: this.formViaje.value.distancia,
                gastos: this.formViaje.value.gastos,
                fecha: this.formViaje.value.fecha,
                cp: this.formViaje.value.cp,
                facturado: this.formViaje.value.facturado,
                cuitUsuario: this.formViaje.value.cuitUsuario,
                totalFacturado: 0,
                borrado: this.formViaje.value.borrado
            };
    
            // Sumar la distancia a kmAceite
            if (this.unidad && this.unidad.kmAceite != null) {
                this.unidad.kmAceite += viaje.distancia;
            } else {
                console.error('kmAceite no está inicializado o no es válido');
            }
    
            // Actualizar el estado de las ruedas usando map en lugar de forEach
            if (this.unidad && this.unidad.estadoRueda && Array.isArray(this.unidad.estadoRueda)) {
                this.unidad.estadoRueda = this.unidad.estadoRueda.map(rueda => rueda + viaje.distancia);
            } else {
                console.error('estadoRueda no es un array o no está inicializado');
            }
    
            // Lógica para guardar o actualizar el viaje
            if (this.dataViaje == null) {
                // Nuevo viaje
                this.unidadService.update(this.unidad).subscribe({
                    next: (data) => {
                    this.mostrarAlerta("camion actualizado");
                },
                error: (e) => {
                    this.mostrarAlerta("No se ha podido actualizar el camión"); 
                }
                });
                console.log(this.unidad);
                this.viajeServicio.add(viaje).subscribe({
                    next: (data) => {
                        this.mostrarAlerta("Viaje cargado al sistema exitosamente");
                        this.dialog.close("Creado");
                    },
                    error: (e) => {
                        this.mostrarAlerta("No se ha podido crear el Viaje");
                    }
                });
            } else {
                // Actualización de viaje existente
                this.unidadService.update(this.unidad).subscribe({
                    next: (data) => {
                    this.mostrarAlerta("camion actualizado");
                },
                error: (e) => {
                    this.mostrarAlerta("No se ha podido actualizar el camión"); 
                }
            });
                this.viajeServicio.update(viaje, viaje.idViaje).subscribe({
                    next: (data) => {
                        this.mostrarAlerta("Viaje editado correctamente");
                        this.dialog.close("Editado");
                    },
                    error: (e) => {
                        this.mostrarAlerta("No se ha podido editar el Viaje");
                    }
                });
            }
        }
    }
    


    onLocationSelected(coords: [number, number]) {
        this.geocodingService.reverseGeocode(coords[0], coords[1]).subscribe((data) => {
            const direccionCompleta = data.display_name;
            const direccionSimplificada = this.simplificarDireccion(direccionCompleta);
            this.formViaje.patchValue({
                inicio: direccionSimplificada, //simplificado de direccion
            });
        });
    }
    
    onDestinationSelected(coords: [number, number]) {
        this.geocodingService.reverseGeocode(coords[0], coords[1]).subscribe((data) => {
            const direccionCompleta = data.display_name;
            const direccionSimplificada = this.simplificarDireccion(direccionCompleta);
            this.formViaje.patchValue({
                final: direccionSimplificada, //simplificado de direccion
            });
        });
    }
    

    onDistanceCalculated(distance: number) {
        this.formViaje.patchValue({
            distancia: `${distance.toFixed(2)}`
        });
    }

    onCancel() {
        this.formViaje.reset();
        this.dialog.close();
    }

    mostrarAlerta(mensaje: string) {
        console.log(mensaje);
    }

    centrarMapa(startCoords: [number, number], endCoords: [number, number]) {

        this.mapComponent.clearMap();
		console.log('Start Coords:', startCoords);
		console.log('End Coords:', endCoords);
		
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
        return partes.slice(0, 4).join(','); // aqui podemos poner hasta que coma tomara los textos
    }

    getCamion(id: number): void {
        this.unidadService.get(id).subscribe(data => {
          this.unidad = data;
        });
      }
	
}
