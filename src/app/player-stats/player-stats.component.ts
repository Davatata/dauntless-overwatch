import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit, OnDestroy {
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
  overallInfo = {};
  compActive = true;
  compArray = [];
  quickArray = [];
  searching = false;

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

  constructor(private http: HttpServiceService) {}

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
    this.searching = true;
    this.temp = this.data;
    this.data = '';
    this.loading = true;
    this.goodQuery = false;
    this.badQuery = false;
    let promise = this.http.getStats(this.temp).then(data => {
      if(data === undefined || data['error']) {
        throw Error('Bad get');
      }
      this.filteredList = [];
      this.battleTag = this.temp;
      this.addSearch(this.battleTag);      
      this.http.setSearches(this.searches);
      this.playerInfo = this.getOverallInfo(data);
      this.goodQuery = true;
      this.loading = false;
      this.compActive = true;
      this.searching = false;
    }).catch(error => {
      this.filteredList = [];
      this.temp = ''; 
      this.loading = false;
      this.badQuery = true;
      this.searching = false;
    });
  }

  addSearch(battleTag) {
    if(this.searches.indexOf(battleTag) === -1) {
      this.searches.push(this.battleTag);
    }    
  }

  // submit query when entered pressed from input
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
    this.data = item;
  }

  toggleMode() {
    this.compActive = (this.compActive === true ? false : true);
  }

  getOverallInfo(data) {
    let compStats = data.competitiveStats.careerStats.allHeroes;
    let played = compStats.game.gamesPlayed
    let wins = compStats.game.gamesWon;
    let ties = compStats.game.gamesTied === undefined ? 0 : compStats.game.gamesTied;
    let lost = played - wins;

    if (ties !== undefined) {
      lost -= ties;
    } else {
      ties = 0;
    }

    const info = {
      icon: data.icon,
      level : (data.prestige * 100) + data.level,
      competitive: data.competitiveStats,
      quickplay: data.quickPlayStats,
      compGames: {
        wins : wins,
        losses : lost,
        ties : ties,
        winRate: ((wins / (played - ties)) * 100).toFixed(2)
      },
      rating: data.rating,
      ratingIcon: data.ratingIcon
    };
    return info;
  }

  ngOnDestroy() {
    this.http.setSearches(this.searches);
  }

}
