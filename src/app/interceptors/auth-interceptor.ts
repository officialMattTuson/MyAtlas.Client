import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = environment.devToken;
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  return next(req);
};