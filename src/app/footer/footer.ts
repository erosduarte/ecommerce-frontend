import { AsyncPipe, DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { map, timer } from "rxjs";

@Component({
  imports: [DatePipe, AsyncPipe],
  selector: "app-footer",
  styleUrl: "./footer.css",
  templateUrl: "./footer.html",
})
export class Footer  {
  hora$ = timer(0, 5000).pipe(map(( ) => new Date));

}
