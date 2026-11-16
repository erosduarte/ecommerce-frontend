import { Component, inject, OnDestroy, OnInit, signal, computed} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../api-service';
import { Product } from '../product.model';
import { Productos } from '../../../productos';
import { EfectoImagenDirective } from '../shared/directives/efecto-imagen';
import { CarritoService } from '../carrito.service';


@Component({
  selector: 'app-detalle-producto',
  imports: [CurrencyPipe, RouterLink, EfectoImagenDirective],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
})
export class DetalleProducto implements OnDestroy, OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly carrito = inject(CarritoService);
  data = Productos;
  producto = signal<Product | null>(null);
  tallaSeleccionada = signal<string | null>(null);
  colorSeleccionado = signal<string | null>(null);
  filtro = signal<string | null>(null);
  cargando = signal(true);
  cubos = [ 'azul', 'rojo', 'verde',
    'azul', 'rojo', 'verde',
    'azul', 'rojo', 'verde'
  ];

  word = signal<string | null>(null);

  cubosFiltrado = computed(()=>{
  const color = this.filtro();
  if(!color) return this.cubos
  return this.cubos.filter((cb) => cb === color);
});

  filtroPalabras(){
    const palabra = this.filtro();

  }


  // color = 'rojo';
  // filtro = rojo
  //@if(rojo === rojo)
  ngOnInit() {
    this.carrito.limpiarMensajes();
    console.log(this.route.snapshot.paramMap.get('id'));
    this.route.queryParamMap.subscribe((params) => {
      this.filtro.set(params.get('color'));
      this.word.set(params.get("name"));
    })


    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      console.log('ID del producto:', id);
      this.cargando.set(true);
      this.api.getCatalogoById(id).subscribe({
        next: (datos) => {
          this.producto.set(datos ?? null);
          if(datos){
            if (datos.size?.length) this.tallaSeleccionada.set(datos.size[0]);
            if (datos.color?.length) this.colorSeleccionado.set(datos.color[0]);
          }
          this.cargando.set(false);
        },
        error: () => {
          this.producto.set(null);
          this.cargando.set(false);
        },
      });
    });
  }

  seleccionarTalla(talla: string) {
    this.tallaSeleccionada.set(talla);
  }

  seleccionarColor(color: string) {
    this.colorSeleccionado.set(color);
  }

  agregarAlCarrito() {
    const p = this.producto();
    if (!p) return;
    this.carrito.agregar(p, 1, this.tallaSeleccionada(), this.colorSeleccionado());
  }

  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwUBBAYCB//EAEQQAAEDAgMCBgwNBAMAAAAAAAEAAgMEEQUGEiExExRRcZGxIjM0NUFSU2Fyk8HhFiMyVFVzdIGDkqHR0kKiwvAVYmP/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAAAATER/9oADAMBAAIRAxEAPwD7iiIgIiICIiAiIgIvDpGN+U5o5yoJMQooz8ZVwN55GoNpFWvx7Cmb66E+ibrXfmjCm/Jnc88jY3FBdIqzD8cosQmMMDntktcNkZpLuZWaAiIgIiICIiAiIgLWxwQEoqaYyO8Hg3G+3Yp73LFW/wBrl+pT2rJdG+F0b3Nda4EXuOS72rq3p8PZt1hERfnn7WREVAREQFhZRBRZa7CfFYfEpZ3Krf7XP1LuvT3rB1/H0b8oOqV5Y9j72c02NtgspS7iq/tcn1LjvT3rB1/H0b8oOqWqT2rD1PH0b8oOqC3CIiAiIgIiICIiAiIgIsXBygIl0QEREBEWLjlQZRYulxyoMosXWUBERAREQEREBYciINLDKmSqpBLLbVrkbsHivcB+gC84TWSVkAfKGg6GO7EcrQT1oiCaed0c9OwAWkk0m/JpcfYsV074WwFluznYw35CdqIg2QSsAm6IgoscxapoazgoRHp4Eu7Jt9ul5/xC0DmCu1Ob8VutfR/3aL8/ZHzIiDZosbq6hmIl7YgaeOmczS075Gguvt86iqMdrI5JWt4KzaoRi7f6byC39g/VEQYgx6tfPGx3B2dU6D2PgJjH+Z6AurG4IiDKIiAiIg//9k=';
  }
  ngOnDestroy(){
    console.log("Se destruyo el componente");
  }
}
