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
  opacity = 0;
  zIndex = 0;
  visible = false;
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
    this.currentMode = 'competitive';
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
      // console.log(this.playerInfo);
      this.topHeroes[this.currentMode] = this.getTopHeroes(this.playerInfo);
      //console.table(this.topHeroes);
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

  hasTimePlayed(arr) {
    return arr.filter(hero => {
      return hero.timePlayed !== "--";
    });
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
      // console.log(this.topHeroes);
    }
  }

  getOverallInfo(data) {
    let careerStats = data.competitiveStats.careerStats;
    let compStats = careerStats.allHeroes;
    let played = compStats.game.gamesPlayed === undefined ? 0 : compStats.game.gamesPlayed;
    let wins =   compStats.game.gamesWon    === undefined ? 0 : compStats.game.gamesWon;
    let ties =   compStats.game.gamesTied   === undefined ? 0 : compStats.game.gamesTied;
    let lost =   played - wins - ties;

    return {
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
      ratingIcon: data.ratingIcon,
      careerStats: careerStats
    };
  }

  getTopHeroes(playerInfo) {
    let temp = playerInfo[this.currentMode]['topHeroes'];
    let heroes = Object.keys(temp).map(heroName => {
      let ar = temp[heroName];
      ar.seconds = this.convertTime(ar.timePlayed);
      ar.hero = heroName.toUpperCase();
      if (playerInfo['careerStats'][heroName]) {
        ar.games = this.getWTL(playerInfo['careerStats'][heroName]['game']);
      }
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

  getWTL(games:Object) {
    let totalPlayed = games['gamesPlayed'] || 0;
    let ties = games['gamesTied'] || 0;
    let wins = games['gamesWon'] || 0;
    let losses = totalPlayed - wins - ties;
    if (ties) {
      return `${wins}-${losses}-${ties}`; 
    }
    return `${wins}-${losses}`; 
  }

  toggleRanks() {
    if (this.visible) {
      this.visible = !this.visible;
      // Remove listener to disable scroll
      window.removeEventListener('scroll', this.noscroll);
      this.opacity = 0;
      this.zIndex = 0;
    } else {
      this.visible = !this.visible;
      // add listener to disable scroll
      window.addEventListener('scroll', this.noscroll);
      this.opacity = 1;
      this.zIndex = 1050;
    }
  }

  // pulled from 'https://davidwells.io/snippets/disable-scrolling-with-javascript/'
  noscroll() {
    window.scrollTo( 0, 0 );
  }

  ngOnDestroy() {
    this.http.setSearches(this.searches);
  }

}
