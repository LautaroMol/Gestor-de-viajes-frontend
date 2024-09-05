import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import 'leaflet-routing-machine';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	public userLocation?: [number, number];

	constructor(@Inject(PLATFORM_ID) private platformId: object) {
		if (isPlatformBrowser(platformId)) {
			this.initUserLocation();
		}
	}

	private initUserLocation() {
		if (navigator.geolocation) {
			this.getUserLocation();
		} else {
			this.userLocation = undefined;
		}
	}

	private getUserLocation() {
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				this.userLocation = [coords.latitude, coords.longitude];
				document.dispatchEvent(new Event('userLocationReady'));
			},
			(error) => {
				console.error('Error getting location:', error);
				this.userLocation = undefined;
			}
		);
	}
}