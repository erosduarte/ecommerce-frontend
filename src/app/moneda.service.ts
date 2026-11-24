import { effect, Injectable, signal } from '@angular/core';

export const MONEDAS = ['AUD', 'EUR', 'USD', 'NZD', 'SGD', 'GBP'] as const;
export type Moneda = (typeof MONEDAS)[number];

const TASAS: Record<Moneda, number> = {
  AUD: 1.52,
  EUR: 0.92,
  USD: 1,
  NZD: 1.68,
  SGD: 1.34,
  GBP: 0.78,
};

@Injectable({ providedIn: 'root' })
export class MonedaService {
  readonly monedas = MONEDAS;
  readonly actual = signal<Moneda>(this.leer());

  constructor() {
    effect(() => {
      try {
        localStorage.setItem('moneda', this.actual());
      } catch {}
    });
  }

  elegir(valor: string) {
    if ((MONEDAS as readonly string[]).includes(valor)) {
      this.actual.set(valor as Moneda);
    }
  }

  convertir(usd: number) {
    return usd * TASAS[this.actual()];
  }

  formatear(usd: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.actual(),
    }).format(this.convertir(usd));
  }

  private leer(): Moneda {
    try {
      const guardada = localStorage.getItem('moneda');
      if (guardada && (MONEDAS as readonly string[]).includes(guardada)) {
        return guardada as Moneda;
      }
    } catch {}
    return 'USD';
  }
}