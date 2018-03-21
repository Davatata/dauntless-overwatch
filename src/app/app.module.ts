import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 


import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpServiceService } from "./http-service.service";
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlayerStatsComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
