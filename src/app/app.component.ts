import { Component } from '@angular/core';

import { HttpServiceService } from "./http-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpServiceService) {}

}
