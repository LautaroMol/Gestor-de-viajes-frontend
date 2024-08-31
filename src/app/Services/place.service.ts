import { Inject, Injectable,PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  	providedIn: 'root'
})
@Injectable()
export class PlacesService {

	public L:any = null;
	public Routing:any = null;
;	public userLocation?: [number, number];

	constructor(@Inject(PLATFORM_ID) private platformId:object) {
		if(isPlatformBrowser(platformId)) {
			this.L = require('leaflet');{
				this.L = require('leaflet');
				this.Routing = require('leaflet-routing-machine');
			}
		}
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
