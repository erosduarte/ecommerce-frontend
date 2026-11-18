import { AsyncPipe, DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { combineLatest, map, of, startWith, timer } from "rxjs";

@Component({
  imports: [DatePipe, AsyncPipe],
  selector: "app-footer",
  styleUrl: "./footer.css",
  templateUrl: "./footer.html",
})
export class Footer  {
 private mensaje$ = timer(5000, 5000).pipe(map(() => "Ya se manejar observables:)"));
 private hora$ = timer(0, 1000).pipe(map(()=> new Date))
 private contador$ = timer(0, 5000).pipe(map((i) => i + 1));

  
  datosCombinados$ = combineLatest([this.mensaje$, this.contador$]).pipe(
    map(([mensaje, contador]) => ({
      mensaje,
      contador
    }))
  );
}
