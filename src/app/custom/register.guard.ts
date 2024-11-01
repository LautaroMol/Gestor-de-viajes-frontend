import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccesoService } from '../Services/acceso.service';
import { of } from 'rxjs';
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
    catchError(() => {

      router.navigate(['/login']);
      return of(false);
    })
  );
};
