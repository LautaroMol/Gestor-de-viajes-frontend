import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';
  private searchUrl = 'https://nominatim.openstreetmap.org/search?format=json';

  constructor(private http: HttpClient) {}

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `${this.baseUrl}&lat=${lat}&lon=${lon}`;
    return this.http.get(url);
  }
  geocodeAddress(address: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    return this.http.get(url);
  }
  forwardGeocode(address: string): Observable<any> {
    const url = `${this.searchUrl}&q=${address}`;
    return this.http.get(url);
  }
}
