import { Routes } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import { GastosComponent } from './Componentes/gastos/gastos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { ConfiguracionComponent } from './Componentes/configuracion/configuracion.component';
import { CamionComponent } from './Componentes/camion/camion.component';
import { LoginComponent } from './Componentes/login/login.component';
import { RegistroComponent } from './Componentes/registro/registro.component';

export const routes: Routes = [
    {path: 'viajes', component:ViajesComponent},
    {path: 'gastos',component:GastosComponent},
    {path: 'perfil',component:PerfilComponent},
    {path: 'configuracion',component:ConfiguracionComponent},
    { path: '',component:LoginComponent },
    {path: 'camion',component:CamionComponent},
    {path: 'registro',component:RegistroComponent}
];
