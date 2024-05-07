import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ViajesComponent,MatButtonModule, MatTooltipModule, MatIconModule]
})
export class AppComponent {

  title = 'Camiones';
  
}
