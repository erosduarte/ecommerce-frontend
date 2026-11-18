import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (auth.isLoggedIn()) {
    const Cabecera = req.clone({
      setHeaders: { "autorizado-por": "eros" },
    });
    return next(Cabecera);
  }

  return next(req);
};