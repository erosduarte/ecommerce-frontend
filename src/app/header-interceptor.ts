import { HttpInterceptorFn } from "@angular/common/http";

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
    const Cabecera = req.clone({
      setHeaders: { "autorizado-por": "eros" },
    });
    return next(Cabecera);
};
