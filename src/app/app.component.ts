import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { TravelComponent } from './Componentes/travel/travel.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ViajesComponent,MatButtonModule, MatTooltipModule,
     MatIconModule, TravelComponent,RouterLink,RouterLinkActive],
     providers: [HttpClient]
})
export class AppComponent {

  title = 'Camiones';
  
}
