import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpServiceService } from '../http-service.service';
import { NgForm } from '@angular/forms';

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
  loading = false;
  overallInfo = {};
  compActive = true;
  searching = false;
  currentMode = 'competitive';
  topHeroes:Object[] = [];

  objectkeys = Object.keys;

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
    if (s !== null) {
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
      // console.log(data);
      this.topHeroes = [];
      this.playerInfo = this.getOverallInfo(data);
      this.topHeroes[this.currentMode] = this.getTopHeroes(this.playerInfo);
      // console.table(this.topHeroes);
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
  onKey(event: any, form: NgForm) {
    if(event.keyCode === 13 && form.form.valid) {
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
    if (this.compActive === true) {
      this.compActive = false;
      this.currentMode = 'quickplay';
    } else {
      this.compActive = true;
      this.currentMode = 'competitive';
    }
    if (!this.topHeroes[this.currentMode]) {
      this.topHeroes[this.currentMode] = this.getTopHeroes(this.playerInfo);
      console.log(this.topHeroes);
    }
  }

  getOverallInfo(data) {
    // console.log(data);
    let compStats = data.competitiveStats.careerStats.allHeroes;
    let played = compStats.game.gamesPlayed === undefined ? 0 : compStats.game.gamesPlayed;
    let wins =   compStats.game.gamesWon    === undefined ? 0 : compStats.game.gamesWon;
    let ties =   compStats.game.gamesTied   === undefined ? 0 : compStats.game.gamesTied;
    let lost =   played - wins - ties;

    const info = {
      icon: data.icon,
      level : (data.prestige * 100) + data.level,
      competitive: data.competitiveStats,
      quickplay: data.quickPlayStats,
      compGames: {
        wins : wins,
        losses : lost,
        ties : ties,
        winRate: ((wins / (played - ties)) * 100).toFixed(1)
      },
      rating: data.rating,
      ratingIcon: data.ratingIcon
    };
    return info;
  }

  getTopHeroes(playerInfo) {
    let temp = playerInfo[this.currentMode]['topHeroes'];
    let heroes = Object.keys(temp).map(key => {
      let ar = temp[key];
      ar.seconds = this.convertTime(ar.timePlayed);
      ar.hero = key.toUpperCase();
      return ar;
    });
    heroes.sort(function (a, b) {
      return b.seconds - a.seconds;
    });
    return heroes;
  }

  convertTime(time:string) {
    if (time === '--') {
      return 0;
    }

    let arr:any = time.split(' ');
    arr[0] = parseInt(arr[0]); // "2" => 2
    if (arr[1].startsWith('second')) {
      return arr[0];
    } else {
      let seconds = (arr[1].startsWith('minute') ? 60 : 3600);
      return arr[0] * seconds;
    }
  }

  ngOnDestroy() {
    this.http.setSearches(this.searches);
  }

}
