import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccesoService } from '../Services/acceso.service';
import { catchError,of,map } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token') || '';
  const router = inject(Router);
  const accesoService = inject(AccesoService);

  if (token) {
    return accesoService.validarToken(token).pipe(
      map((data) => {
        if (data.isSuccess) {
          return true;
        } else {
          localStorage.removeItem('token');
          router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        return of(false);
      })
    );
  } else {
    router.navigate(['/login']);
    return of(false);
  }
};
