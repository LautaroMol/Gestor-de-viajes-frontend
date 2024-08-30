import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { PlacesService } from '../../Services/place.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
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

  ngAfterViewInit() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initializeMap();
    }
  }

  initializeMap() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (this.map) {
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
            (window as any).L.Control.geocoder({ defaultMarkGeocode: false })
              .on('markgeocode', (e: { geocode: { bbox: any; }; }) => {
                var bbox = e.geocode.bbox;
                var poly = L.polygon([
                  bbox.getSouthEast(),
                  bbox.getNorthEast(),
                  bbox.getNorthWest(),
                  bbox.getSouthWest()
                ]).addTo(this.map);

                this.map.fitBounds(poly.getBounds());
              })
              .addTo(this.map);
          } else {
            console.error('Leaflet Control Geocoder is not available.');
          }
        }).catch(err => {
          console.error('Error loading Leaflet Control Geocoder:', err);
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
        console.error('Error loading Leaflet:', err);
      });
    }
  }
}
