import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import L from 'leaflet';
import "leaflet-routing-machine";
import { PlacesService } from '../../Services/place.service';
import Geocoder from 'leaflet-control-geocoder';


@Component({
	selector: 'app-map',
	standalone: true,
	imports: [],
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
	geo: any;
	map: any;
	currentLocationMarker: any;
	chosenLocationMarker: any;
	isLocated = false;
	routeControl: any;
	private baseUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';
	
	@Output() locationSelected = new EventEmitter<[number, number]>();
	@Output() destinationSelect = new EventEmitter<[number, number]>();
	@Output() distanceCalculated = new EventEmitter<number>();

	constructor(private placeSvc: PlacesService,
	) {}

	Reload() {
		localStorage.removeItem('geoLoc');
		location.reload();
	}

	Locate() {
		if (this.map && this.geo && !this.isLocated) {
			this.geo = this.placeSvc.userLocation;

			this.currentLocationMarker = L.marker(this.geo)
				.addTo(this.map)
				.bindPopup('<b>Ubicación actual</b>')
				.openPopup();

			this.isLocated = true;
			localStorage.setItem('geoLoc', JSON.stringify(this.geo));

			this.currentLocationMarker.on('moveend', () => {
				const latLng = this.currentLocationMarker.getLatLng();
				this.geo = [latLng.lat, latLng.lng];
				localStorage.setItem('geoLoc', JSON.stringify(this.geo));
			});

			this.locationSelected.emit(this.geo);
			this.map.flyTo(this.geo, 13);
		}
	}
	CalculateRoute() {
		if (this.map && this.currentLocationMarker && this.chosenLocationMarker) {
			const start = this.currentLocationMarker.getLatLng();
			const end = this.chosenLocationMarker.getLatLng();

			if (this.routeControl) {
				this.map.removeControl(this.routeControl);
			}

			this.routeControl = L.Routing.control({
				waypoints: [
					L.latLng(start.lat, start.lng),
					L.latLng(end.lat, end.lng)
				],
				routeWhileDragging: true,
				show: false
			}).addTo(this.map);

			// const distanceInMeters = this.map.distance(start, end);
			// const distanceInKilometers = distanceInMeters / 1000;
			// alert(`La distancia entre los marcadores es de ${distanceInKilometers.toFixed(2)} kilómetros.`);
		
			this.distanceCalculated.emit(this.map.distance(start, end) / 1000)
		}
	}

	calculaRuta(start: [number, number], end: [number, number]) {
		if (this.map) {
			if (this.routeControl) {
				this.map.removeControl(this.routeControl);
			}
	
			this.routeControl = L.Routing.control({
				waypoints: [
					L.latLng(start[0], start[1]),
					L.latLng(end[0], end[1])
				],
				routeWhileDragging: true,
				show: false
			}).addTo(this.map);
	
			// Emitir distancia calculada
			const distanceInMeters = this.map.distance(
				L.latLng(start[0], start[1]),
				L.latLng(end[0], end[1])
			);
			this.distanceCalculated.emit(distanceInMeters / 1000);
		}
	}

	ngOnInit() {
		this.isLocated = false;
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			document.addEventListener('userLocationReady', () => {
				this.initializeMap();
				setTimeout(() => {
					this.geo = this.placeSvc.userLocation;
					if (this.geo) {
						localStorage.setItem('geoLoc', JSON.stringify(this.geo));
					}
				}, 1000);
			});
		}
	}

	ngAfterViewInit() {
		if (this.placeSvc.userLocation) {
			setTimeout(() => {
				this.clearMap();
				this.geo = this.placeSvc.userLocation;
				if (this.geo) {
					this.initializeMap();
				}
			},1800);
		}
	}

	initializeMap() {
		if (this.map) {
			return;
		}

		this.geo = this.placeSvc.userLocation;
		if (this.geo) {
			this.map = L.map('map').setView(this.geo, 13);

			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(this.map);
      
			// Geocoder integration
			const geocoder = new Geocoder({
				defaultMarkGeocode: false,
			})
			.on('markgeocode', (e: any) => {
				const bbox = e.geocode.bbox;
				const poly = L.polygon([
					bbox.getSouthEast(),
					bbox.getNorthEast(),
					bbox.getNorthWest(),
					bbox.getSouthWest(),
				]).addTo(this.map);
				this.map.fitBounds(poly.getBounds());
			})
			.addTo(this.map);

			this.map.on('click', (e: L.LeafletMouseEvent) => {
				const { lat, lng } = e.latlng;
				if (this.chosenLocationMarker) {
					this.chosenLocationMarker.setLatLng([lat, lng]);
				} else {
					this.chosenLocationMarker = L.marker([lat, lng], { draggable: true })
						.addTo(this.map)
						.bindPopup('<b>Ubicación elegida</b>')
						.openPopup();
				}
				this.destinationSelect.emit([lat, lng]);
			});
		}
	}
	setMapView(coords: [number, number]) {
		if (this.map) {
			if (!isNaN(coords[0]) && !isNaN(coords[1])) {
				this.map.setView(coords, 13);
			} else {
				console.error('Invalid LatLng object:', coords);
			}
		}
	}
	
	addMarker(coords: [number, number], message: string) {
        if (this.map) {
            L.marker(coords).addTo(this.map).bindPopup(message);
        }
    }

	clearMap() {
		if (this.map) {
			this.map.eachLayer((layer: any) => {
				if (layer instanceof L.Marker || layer instanceof L.Polyline) {
					this.map.removeLayer(layer);
				}
			});
		}
	}

	addStartMarker(coords: [number, number]) {
		if (this.map) {
			L.marker(coords).addTo(this.map).bindPopup('<b>Inicio del viaje</b>').openPopup();
		}
	}
	
	addEndMarker(coords: [number, number]) {
		if (this.map) {
			L.marker(coords).addTo(this.map).bindPopup('<b>Fin del viaje</b>').openPopup();
		}
	}
	
}