import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeEventService {
  private viajeActualizadoSource = new BehaviorSubject<boolean>(false);
  viajeActualizado$ = this.viajeActualizadoSource.asObservable();
  constructor() { }

  emitirActualizacionViaje() {
    this.viajeActualizadoSource.next(true);
  }
}
