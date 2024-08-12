import { Injectable } from '@angular/core';

@Injectable({
  	providedIn: 'root'
})
export class PlacesService {
  
	public userLocation?: [number, number];

	constructor() {
		this.initUserLocation();
	}

	private initUserLocation() {
		if (typeof window !== 'undefined' && navigator.geolocation) {
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
			}, (error) => {
				console.error('Error getting location:', error);
				this.userLocation = undefined;
			}
		);
	}
}
