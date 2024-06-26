import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import { TravelComponent } from './Componentes/travel/travel.component';
import { GastosComponent } from './Componentes/gastos/gastos.component';

const routes: Routes = [
	{ path: 'travel', component: TravelComponent },
	{ path: 'viajes', component: ViajesComponent },
	{ path: 'gastos', component: GastosComponent },
	{ path: '', redirectTo: '/viajes', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
