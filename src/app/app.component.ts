import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ViajesComponent]
})
export class AppComponent {
  title = 'Camiones';
  
}
