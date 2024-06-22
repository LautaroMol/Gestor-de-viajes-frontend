import { Routes } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import { TravelComponent } from './Componentes/travel/travel.component';
import { CargaFormComponent } from './Modals/carga-form/carga-form.component';
import { GastosComponent } from './Componentes/gastos/gastos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';

export const routes: Routes = [
    {path: 'viajes', component:ViajesComponent},
    {path: 'travel',component:TravelComponent},
    {path: 'carga',component:CargaFormComponent},
    {path: 'gastos',component:GastosComponent},
    {path: 'perfil',component:PerfilComponent},
    { path: '', redirectTo: '/viajes', pathMatch: 'full' },
];
