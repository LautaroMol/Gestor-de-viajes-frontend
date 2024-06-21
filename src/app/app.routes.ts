import { Routes } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import { TravelComponent } from './Componentes/travel/travel.component';
import { CargaFormComponent } from './Modals/carga-form/carga-form.component';
import { GastosComponent } from './Componentes/gastos/gastos.component';

export const routes: Routes = [
    {path: 'viajes', component:ViajesComponent},
    {path: 'travel',component:TravelComponent},
    {path: 'carga',component:CargaFormComponent},
    {path: 'gastos',component:GastosComponent},
    { path: '', redirectTo: '/viajes', pathMatch: 'full' },
];
