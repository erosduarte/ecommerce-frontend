import { inject, Pipe, PipeTransform } from '@angular/core';
import { MonedaService } from './moneda.service';

@Pipe({ name: 'precio', pure: false })
export class PrecioPipe implements PipeTransform {
  private readonly moneda = inject(MonedaService);

  transform(valor: number | null | undefined) {
    return this.moneda.formatear(valor ?? 0);
  }
}