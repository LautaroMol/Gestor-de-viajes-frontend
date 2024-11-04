import { Routes } from '@angular/router';
import { ViajesComponent } from './Componentes/viajes/viajes.component';
import { GastosComponent } from './Componentes/gastos/gastos.component';
import { PerfilComponent } from './Componentes/perfil/perfil.component';
import { ConfiguracionComponent } from './Componentes/configuracion/configuracion.component';
import { CamionComponent } from './Componentes/camion/camion.component';
import { LoginComponent } from './Componentes/login/login.component';
import { RegistroComponent } from './Componentes/registro/registro.component';
import { authGuard } from './custom/auth.guard';
import { registroGuard } from './custom/register.guard';

// export const routes: Routes = [
//   { path: 'viajes', component: ViajesComponent, canActivate: [authGuard] },
//   { path: 'gastos', component: GastosComponent, canActivate: [authGuard] },
//   { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
//   { path: 'configuracion', component: ConfiguracionComponent, canActivate: [authGuard] },
//   { path: 'camion', component: CamionComponent, canActivate: [authGuard] },
//   { path: 'registro', component: RegistroComponent, canActivate: [registroGuard] },
//   { path: 'login', component: LoginComponent },

//   { path: '', redirectTo: localStorage.getItem('token') ? '/viajes' : '/login', pathMatch: 'full' },

//   { path: '**', redirectTo: '/login' }
// ];

export const routes: Routes = [
  {path: 'viajes', component:ViajesComponent,canActivate: [authGuard]},
  {path: 'gastos',component:GastosComponent,canActivate: [authGuard]},
  {path: 'perfil',component:PerfilComponent,canActivate: [authGuard]},
  {path: 'configuracion',component:ConfiguracionComponent,canActivate: [authGuard]},
  {path: 'camion',component:CamionComponent,canActivate: [authGuard]},
  {path: 'registro',component:RegistroComponent, canActivate: [registroGuard]},
  { path: 'login',component:LoginComponent },
  { path: '**', redirectTo: '/login' }
];
