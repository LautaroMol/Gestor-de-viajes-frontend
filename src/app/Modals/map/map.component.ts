import { Component, OnInit, AfterViewInit, Output, EventEmitter, Inject, PLATFORM_ID,Input } from '@angular/core';
import { PlacesService } from '../../Services/place.service';
import { CommonModule } from '@angular/common';
import {icon,Map,Marker,tileLayer} from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  geo: any;
  map: any;
  // currentLocationMarker: any;
  // chosenLocationMarker: any;
  // isLocated = false;
  // routeControl: any;
  // @Output() locationSelected = new EventEmitter<[number, number]>();
  // @Output() destinationSelect = new EventEmitter<[number, number]>();
  // @Output() distanceCalculated = new EventEmitter<number>();

  constructor(
    private placeSvc: PlacesService,

  ) {}
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

  ngOnInit():void {
    setTimeout(() => {
      console.log("placesvc: ", this.placeSvc);
    }, 2000);
  }

  ngAferViewInit(){
    setTimeout(() => {
      this.map = new Map('map').setView([51.505, -0.09], 13);
    }, 2000);
  }
    // if (isPlatformBrowser(this.platformId)) {
    //   document.addEventListener('userLocationReady', () => {
    //     this.initializeMap();
    //     setTimeout(() => {
    //       this.geo = this.placeSvc.userLocation;
    //       if (this.geo) {
    //         localStorage.setItem('geoLoc', JSON.stringify(this.geo));
    //       }
    //     }, 500);
    //   });
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
