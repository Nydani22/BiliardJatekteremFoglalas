import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  const authService=inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user=>{
      if (user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = await authService.getRole();

  if (role === 'admin') {
    return true;
  }

  router.navigate(['/fooldal']);
  return false;
};



export const publicGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  const authService=inject(AuthService);

  return authService.currentUser.pipe(
    take(1),
    map(user=>{
      if (!user) {
        return true;
      }
        
      router.navigate(['/fooldal']);
      return false;
    })
  );
};
