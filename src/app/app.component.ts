import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { NuevoViajeFormComponent } from './Modals/nuevo-viaje-form/nuevo-viaje-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Viaje } from './Interfaces/viaje';
import { ViajeService } from './Services/viaje.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ViajesComponent,MatButtonModule, MatTooltipModule,
     MatIconModule,RouterLink,RouterLinkActive, NuevoViajeFormComponent],
     providers: [HttpClient]
})
export class AppComponent {

	viajes: Viaje[] = [];
	title = 'Camiones';

	constructor(private dialog: MatDialog,
		private viajeService: ViajeService
	) {
		if (globalThis.window === undefined) {
			globalThis.window =
			  ({
				addEventListener: () => {},
			  } as never);
		  }
	}
nuevoViaje() {
		this.dialog.open(NuevoViajeFormComponent, {
			disableClose: true,
			width: '900px',
			data: null
		}).afterClosed().subscribe(result => {
			if (result) {
				this.obtenerViajes();
				console.log('Nuevo viaje creado o actualizado:', result);
			}
		});
  }
  obtenerViajes(){
    this.viajeService.getList().subscribe({
      next: (data) => {
        this.viajes = data.filter(viaje => !viaje.borrado);
      },
      error: (e) => {
      },
    });
  }
}
