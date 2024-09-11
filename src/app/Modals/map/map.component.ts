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
	
	@Output() locationSelected = new EventEmitter<[number, number]>();
	@Output() destinationSelect = new EventEmitter<[number, number]>();
	@Output() distanceCalculated = new EventEmitter<number>();

	constructor(private placeSvc: PlacesService) {}

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
				}, 2000);
			});
		}
	}

	ngAfterViewInit() {
		if (this.placeSvc.userLocation) {
			setTimeout(() => {
				this.geo = this.placeSvc.userLocation;
				if (this.geo) {
					this.initializeMap();
				}
			}, 3000);
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
}