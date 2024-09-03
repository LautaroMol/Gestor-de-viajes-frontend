import {Component,OnInit,ViewChild,ElementRef,AfterViewInit,OnDestroy,} from '@angular/core';
import { PlacesService } from '../../Services/place.service';
import { CommonModule } from '@angular/common';
import { Map, MapStyle, config,Marker, MaptilerNavigationControl, MaptilerGeolocateControl } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import * as maptilerClient from '@maptiler/client';
import * as maptilersdk from '@maptiler/sdk';
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@maptiler/geocoding-control/style.css";


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  geo: any;
  map: Map | undefined;
  currentLocationMarker: Marker | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private placeSvc: PlacesService) {}
  ngOnDestroy(): void {
    this.map?.remove();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
  
            console.log('con alta precisión lat: ', lat, ' long: ', lng);
  
            const initialState = {
              lng: lng,
              lat: lat,
              zoom: 14
            };
  
            this.map = new Map({
              container: this.mapContainer.nativeElement,
              style: MapStyle.STREETS,
              center: [initialState.lng, initialState.lat],
              zoom: initialState.zoom,
              terrainControl: true
            });
            const gc = new GeocodingControl();
            this.map.addControl(gc);
            this.map.addControl(new MaptilerGeolocateControl({
              positionOptions:{
                enableHighAccuracy:true
              },
              trackUserLocation: true,
              showAccuracyCircle: true,
              showUserLocation: true
            }));
          },
          (error) => {
            console.error('Error al obtener la geolocalización', error);
          },
          {
            enableHighAccuracy: true, // Alta precisión
            timeout: 5000, // 5 segundos de tiempo máximo
            maximumAge: 0 // No usar una posición en caché
          }
        );
      } else {
        console.error('La geolocalización no es compatible con este navegador');
      }
    }, 2000);
  }
  
  ngOnInit(): void {
    config.apiKey = 'oEDh6mPK2TIhdFrpa70J';
  }

  locate(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (this.map) {
            // Mover el mapa a la ubicación actual
            this.map.flyTo({center: [lng, lat],zoom: 14});

            // Si hay un amrcador lo actualizamos
            if (this.currentLocationMarker) {
              this.currentLocationMarker.setLngLat([lng, lat]);
            } else {
              
              this.currentLocationMarker = new Marker()
                .setLngLat([lng, lat])
                .addTo(this.map);
            }
          }
        },
        (error) => {
          console.error('Error al obtener la geolocalización', error);
        },
        {
          enableHighAccuracy: true, // Alta precisión
          timeout: 5000, // 5 segundos de tiempo máximo
          maximumAge: 0 // No usar una posición en caché
        }
      );
    } else {
      console.error('La geolocalización no es compatible con este navegador');
    }
  }
  //    @Inject(PLATFORM_ID) private platformId: Object
  // Reload() {
  //   localStorage.removeItem('geoLoc');
  //   location.reload();
  // }

  // Locate() {
  //   if (this.map && this.geo && !this.isLocated) {
  //     this.geo = this.placeSvc.userLocation;

  //     this.currentLocationMarker = L.marker(this.geo)
  //       .addTo(this.map)
  //       .bindPopup('<b>Ubicación actual</b>')
  //       .openPopup();

  //     this.isLocated = true;

  //     localStorage.setItem('geoLoc', JSON.stringify(this.geo));

  //     this.currentLocationMarker.on('moveend', () => {
  //       const latLng = this.currentLocationMarker.getLatLng();
  //       this.geo = [latLng.lat, latLng.lng];
  //       localStorage.setItem('geoLoc', JSON.stringify(this.geo));
  //     });

  //     this.locationSelected.emit(this.geo);
  //     this.map.flyTo(this.geo, 13);
  //   }
  // }

  // CalculateRoute() {
  //   if (this.map && this.currentLocationMarker && this.chosenLocationMarker) {
  //     const start = this.currentLocationMarker.getLatLng();
  //     const end = this.chosenLocationMarker.getLatLng();

  //     if (this.routeControl) {
  //       this.map.removeControl(this.routeControl);
  //     }

  //     this.routeControl = L.Routing.control({
  //       waypoints: [
  //         L.latLng(start.lat, start.lng),
  //         L.latLng(end.lat, end.lng),
  //       ],
  //       routeWhileDragging: true,
  //       show: false,
  //     }).addTo(this.map);

  //     const distanceInKilometers = this.map.distance(start, end) / 1000;
  //     this.distanceCalculated.emit(distanceInKilometers);
  //   }
  // }

  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     if (this.placeSvc.userLocation) {
  //       setTimeout(() => {
  //         this.geo = this.placeSvc.userLocation;
  //         if (this.geo) {
  //           this.initializeMap();
  //         }
  //       }, 2000);
  //     }
  //   }
  // }

  // initializeMap() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     if (this.map) {
  //       return;
  //     }

  //     this.geo = this.placeSvc.userLocation;
  //     if (this.geo) {
  //       this.map = L.map('map').setView(this.geo, 13);

  //       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         maxZoom: 19,
  //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //       }).addTo(this.map);

  //       // Corrección del error: Uso correcto de L.Control.Geocoder
  //       this.placeSvc.L.Control.geocoder({
  //         defaultMarkGeocode: false
  //       })
  //         .on('markgeocode', (e: any) => {
  //           const bbox = e.geocode.bbox;
  //           const poly = L.polygon([
  //             bbox.getSouthEast(),
  //             bbox.getNorthEast(),
  //             bbox.getNorthWest(),
  //             bbox.getSouthWest()
  //           ]).addTo(this.map);
  //           this.map.fitBounds(poly.getBounds());
  //         })
  //         .addTo(this.map);

  //       this.map.on('click', (e: L.LeafletMouseEvent) => {
  //         const { lat, lng } = e.latlng;

  //         if (this.chosenLocationMarker) {
  //           this.chosenLocationMarker.setLatLng([lat, lng]);
  //         } else {
  //           this.chosenLocationMarker = L.marker([lat, lng], { draggable: true })
  //             .addTo(this.map)
  //             .bindPopup('<b>Ubicación destino</b>')
  //             .openPopup();
  //         }

  //         this.destinationSelect.emit([lat, lng]);
  //       });
  //     }
  //   }
  // }
}
