import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccesoService } from '../Services/acceso.service';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export const registroGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accesoService = inject(AccesoService);

  return accesoService.getUser().pipe(
    map(user => {
      if (user) {
        router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    }),
    catchError((error) => {
      if (error.status === 404) {
        return of(true);
      } else {

        router.navigate(['/login']);
        return of(false);
      }
    })
  );
};
