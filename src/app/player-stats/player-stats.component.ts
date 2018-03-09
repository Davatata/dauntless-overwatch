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
  searches = [];
  filteredList = [];
  compStats = {};
  quickStats = {};
  loading = false;

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
  }

  ngOnInit() {
    let s = this.http.getSearches();
    // console.log(`s is ${s}`);
    if (s === null) {
      this.searches = [];
    } else {
      this.searches = s.split(',');
    }
  }

  // use input field to get data
  getData() {
    this.loading = true;
    this.goodQuery = false;
    this.badQuery = false;
    let promise = this.http.getStats(this.data).then(data => {
      if(data === undefined) {
        throw Error('Bad get');
      }
      this.filteredList = [];
      this.battleTag = this.data;
      this.addSearch(this.battleTag);      
      // console.log(this.searches);
      this.http.setSearches(this.searches);
      this.playerInfo = data['us']['stats']['competitive']['overall_stats'];
      // console.log(data['us']);
      this.data = '';
      this.goodQuery = true;
      this.loading = false;
    }).catch(error => {
      this.data = ''; 
      this.loading = false;
      this.badQuery = true;
      // console.error(error);
    });
  }

  addSearch(battleTag) {
    if(this.searches.indexOf(battleTag) === -1) {
      this.searches.push(this.battleTag);
    }    
  }

  onKey(event: any) {
    if(event.keyCode === 13) {
      this.getData();
    } else {
      if (this.data !== ""){
        this.filteredList = this.searches.filter(el => {
            return el.toLowerCase().includes(this.data.toLowerCase());   
        });
      } else{
          this.filteredList = [];
      }
    }
  }

  select(item) {
    // console.log(`item: ${item}`);
    this.data = item;
  }

  ngOnDestroy() {
    this.http.setSearches(this.searches);
  }

}
