import { Component, OnInit, AfterViewInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PlacesService } from '../Services/place.service';

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
  isBrowser: boolean;

  @Output() locationSelected = new EventEmitter<[number, number]>();  
  @Output() destinationSelect = new EventEmitter<[number, number]>();
  @Output() distanceCalculated = new EventEmitter<number>();

  constructor(private placeSvc: PlacesService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  Reload() {
    if (this.isBrowser) {
      localStorage.removeItem('geoLoc');
      location.reload();
    }
  }

  Locate() {
    if (this.isBrowser && this.map && this.geo && !this.isLocated) {
      import('leaflet').then(L => {
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
      }).catch(err => {
        console.error('Error loading Leaflet marker:', err)
      });
    }
  }

  CalculateRoute() {
    if (this.isBrowser && this.map && this.currentLocationMarker && this.chosenLocationMarker) {
      const start = this.currentLocationMarker.getLatLng();
      const end = this.chosenLocationMarker.getLatLng();
    
      import('leaflet-routing-machine').then(() => {
        const { latLng, Routing } = (window as any).L;

        if (this.routeControl) {
          this.map.removeControl(this.routeControl);
        }

        this.routeControl = Routing.control({
          waypoints: [
            latLng(start.lat, start.lng),
            latLng(end.lat, end.lng)
          ],
          routeWhileDragging: true,
          show: false
        }).addTo(this.map);

        const distanceInKilometers = (this.map.distance(start, end)) / 1000;

        this.distanceCalculated.emit(distanceInKilometers);
      }).catch(err => {
        console.error('Error loading Leaflet Routing Machine:', err)
      });
    }
  }
  
  ngOnInit() {
    this.isLocated = false;
    if (this.isBrowser) {
      document.addEventListener('userLocationReady', () => {
        this.initializeMap();
        setTimeout(() => {
          this.geo = this.placeSvc.userLocation;
          if (this.geo) {
            localStorage.setItem('geoLoc', JSON.stringify(this.geo));
          }
        }, 500);
      });
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      if (this.placeSvc.userLocation) {
        setTimeout(() => {
          this.geo = this.placeSvc.userLocation;
          if (this.geo) {
            this.initializeMap();
          }
        }, 2000);
      }
    }
  }

  initializeMap() {
    if (!this.isBrowser || this.map) {
      return; 
    }

    this.geo = this.placeSvc.userLocation;
    if (this.geo) {
      import('leaflet').then(L => {
        this.map = L.map('map').setView(this.geo, 13);
      
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        import('leaflet-control-geocoder').then(() => {
          if ((window as any).L.Control && (window as any).L.Control.Geocoder) {
            (window as any).L.Control.geocoder({defaultMarkGeocode: false})
                                  .on('markgeocode', (e: { geocode: { bbox: any; }; }) => {
              const bbox = e.geocode.bbox;
              
              const poly = L.polygon(
                [
                  bbox.getSouthEast(),
                  bbox.getNorthEast(),
                  bbox.getNorthWest(),
                  bbox.getSouthWest()
                ]
              ).addTo(this.map);

              this.map.fitBounds(poly.getBounds());
            })
            .addTo(this.map);
          } else {
            console.error('Leaflet Control Geocoder is not available.');
          }
        }).catch(err => {
          console.error('Error loading Leaflet Control Geocoder:', err)
        });

        this.map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;

          if (this.chosenLocationMarker) {
            this.chosenLocationMarker.setLatLng([lat, lng]);
          } else {
            this.chosenLocationMarker = L.marker([lat, lng], { draggable: true })
                                          .addTo(this.map)
                                          .bindPopup('<b>Ubicación destino</b>')
                                          .openPopup();
          }
          this.destinationSelect.emit([lat, lng]);
        });
      }).catch(err => {
        console.error('Error loading Leaflet:', err)
      });
    }
  }
}
