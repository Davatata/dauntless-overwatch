import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable} from "rxjs/Observable";

import { Subscription } from 'rxjs/Subscription';
import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit, OnDestroy {
  playerData: Observable<any>;
  subscription: Subscription;

  title = 'Dauntless Overwatch';
  data:string = '';
  temp:string = '';
  battleTag:string = '';
  playerInfo = {};
  goodQuery = false;
  badQuery = false;

  pos = 0;
  players = [
    'gorgoyle#1281',
    // 'Adibudi#1830',
    'whisperid#1187',
    'Poko#2323',
    // 'Honeybunz#11553',
    // 'NeilBeanz#1405',
    'metaphysics#11256'
  ];

  constructor(private http: HttpServiceService) {
    // this.http.getStats(this.data).then(data => {
    //   console.table(data['us']['stats']['competitive']['overall_stats']);
    //   this.playerInfo = data['us']['stats']['competitive']['overall_stats'];
    // });
  }

  ngOnInit() {
    
  }

  // rotate the array on button click
  // getData() {
  //   let promise = this.http.getStats(this.players[this.pos]).then(data => {
  //     this.data = this.players[this.pos];
  //     this.pos++;
  //     if (this.pos >= this.players.length) {
  //       this.pos = 0;        
  //     }
  //     console.table(data['us']['stats']['competitive']['overall_stats']);
  //     this.playerInfo = data['us']['stats']['competitive']['overall_stats'];
  //   });
  // }

  // use input field to get data
  getData() {    
    let promise = this.http.getStats(this.data).then(data => {
      if(data === undefined) {
        throw Error('Bad get');
      }
      this.battleTag = this.data;
      // console.log(data['us']['stats']['competitive']);
      this.playerInfo = data['us']['stats']['competitive']['overall_stats'];
      this.goodQuery = true;
      this.data = ''; 
      this.badQuery = false;
    }).catch(error => {
      this.data = ''; 
      this.goodQuery = false;
      this.badQuery = true;
      // console.error(error);
    });
  }

  ngOnDestroy() {
  }

}
