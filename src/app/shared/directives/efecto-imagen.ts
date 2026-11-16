import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appEfectoImagen]',
  standalone: true
})
export class EfectoImagenDirective {
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    this.el.nativeElement.style.transition = 'filter 0.3s ease, transform 0.3s ease';
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.filter = 'blur(4px)';
    this.el.nativeElement.style.transform = 'scale(0.8)';
  }

  @HostListener(`mouseleave`) onMouseLeave(){
    this.el.nativeElement.style.filter =`blur(0px)`;
    this.el.nativeElement.style.transform = `scale(1.0)`;
  }

}
