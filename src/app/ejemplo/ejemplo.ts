import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  imports: [RouterLink],
  selector: 'app-ejemplo',
  styleUrl: './ejemplo.css',
  templateUrl: './ejemplo.html',
})
export class Ejemplo implements OnInit {


private readonly infoRuta = inject(ActivatedRoute);
   id = this.infoRuta.snapshot.paramMap.get('id');
   mensaje = '';
   ngOnInit(): void {
    this.mensaje = `Este es el parametro de id:  ${this.id}`;
  }




}
