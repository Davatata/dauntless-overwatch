import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
})
export class PlayerStatsComponent implements OnInit, OnDestroy {
  title = 'Dauntless Overwatch';
  data = '';
  temp = '';
  battleTag = '';
  playerInfo: any = {};
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
  topHeroes: Object[] = [];
  opacity = 0;
  zIndex = -1;
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
  errorString: string;
  urlParams: any;
  urlBattletag: string;

  constructor(private http: HttpServiceService) {}

  ngOnInit() {
    const s = this.http.getSearches();
    // console.log(`s is ${s}`);
    if (s !== null) {
      this.searches = s.split(',');
    }
    this.urlBattletag = this.getParam('battletag');
    if (this.urlBattletag) {
      this.data = this.urlBattletag.split('-').join('#');
      this.getData();
    }
  }

  // grabbed from https://stackoverflow.com/a/43378874/3602679
  getParam(param) {
    this.urlParams = new URLSearchParams(window.location.search);
    return this.urlParams.get(param);
  }

  // use input field to get data
  getData() {
    this.errorString = '';
    this.searching = true;
    this.temp = this.data;
    this.data = '';
    this.loading = true;
    this.goodQuery = false;
    this.badQuery = false;
    this.currentMode = 'competitive';
    this.http.getStats(this.temp).then(data => {
      if (data === undefined || data['error']) {
        this.errorString = 'couldn\'t find profile.';
        throw Error('Bad get');
      }
      // console.table(data);
      // console.log('passed the data check');
      this.filteredList = [];
      this.battleTag = this.temp;
      this.addSearch(this.battleTag);
      this.http.setSearches(this.searches);
      // console.log(data);
      this.topHeroes = [];
      this.playerInfo = this.getOverallInfo(data);
      // console.log('passed getOverallinfo');
      this.topHeroes[this.currentMode] = this.getTopHeroes(this.playerInfo);
      // console.table(this.topHeroes);
      this.goodQuery = true;
      this.loading = false;
      this.compActive = true;
      this.searching = false;
    }).catch(error => {
      if (this.errorString === '') {
        this.errorString = 'profile might be private.';
      }
      this.filteredList = [];
      this.removeBadSearch(this.temp);
      this.temp = '';
      this.loading = false;
      this.badQuery = true;
      this.searching = false;
    });
  }

  removeBadSearch(tempBattleTag) {
    const pos = this.searches.indexOf(tempBattleTag);
    if (pos !== -1) {
      this.searches.splice(pos, 1);
      this.http.setSearches(this.searches);
    }
  }

  addSearch(battleTag) {
    if (this.searches.indexOf(battleTag) === -1) {
      // console.log('adding battletag to searches');
      this.searches.push(this.battleTag);
    }
  }

  // submit query when entered pressed from input
  onKey(event: any, form: NgForm) {
    if (event.keyCode === 13 && form.form.valid) {
      this.getData();
    } else {
      if (this.data !== '') {
        this.filteredList = this.searches.filter(el => {
            return el.toLowerCase().includes(this.data.toLowerCase());
        });
      } else {
          this.filteredList = [];
      }
    }
  }

  select(item) {
    this.data = item;
  }

  hasTimePlayed(arr) {
    return arr.filter(hero => {
      return hero.timePlayed !== '--';
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
    const careerStats = data.competitiveStats.careerStats;
    const compStats = careerStats.allHeroes;
    const played = compStats.game.gamesPlayed === undefined ? 0 : compStats.game.gamesPlayed;
    const wins =   compStats.game.gamesWon    === undefined ? 0 : compStats.game.gamesWon;
    const ties =   compStats.game.gamesTied   === undefined ? 0 : compStats.game.gamesTied;
    const lost =   played - wins - ties;

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
    const temp = playerInfo[this.currentMode]['topHeroes'];
    // console.table(temp);
    const heroes = Object.keys(temp).map(heroName => {
      const heroData = temp[heroName];
      heroData.seconds = this.convertTime(heroData.timePlayed);
      heroData.hero = heroName.toUpperCase();
      if (playerInfo['careerStats'][heroName]) {
        heroData.games = this.getWTL(playerInfo['careerStats'][heroName]['game']);
      }
      return heroData;
    });
    heroes.sort(function (a, b) {
      return b.seconds - a.seconds;
    });
    return heroes;
  }

  convertTime(time: string) {
    if (time === '--') {
      return 0;
    }
    const arr: any = time.split(':');
    if (arr.length === 2) {
      arr[2] = arr[1];
      arr[1] = arr[0];
      arr[0] = '0';
    }
    arr.map(x => parseInt(x, 10));

    arr[0] *= 3600;
    arr[1] *= 60;

    return arr[0] + arr[1] + arr[2];
  }

  getWTL(games: Object) {
    const totalPlayed = games['gamesPlayed'] || 0;
    const ties = games['gamesTied'] || 0;
    const wins = games['gamesWon'] || 0;
    const losses = totalPlayed - wins - ties;
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
      this.zIndex = -1;
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

  resetSuggestions() {
    this.data = '';
    this.filteredList = [];
  }

  getRankTitle(srAmount) {
    if (srAmount < 1500) {
      return 'Bronze';
    } else if (srAmount < 2000) {
      return 'Silver';
    } else if (srAmount < 2500) {
      return 'Gold';
    } else if (srAmount < 3000) {
      return 'Platinum';
    } else if (srAmount < 3500) {
      return 'Diamond';
    } else if (srAmount < 4000) {
      return 'Master';
    } else if (srAmount > 4000) {
      return 'Grand Master';
    }
  }

  ngOnDestroy() {
    this.http.setSearches(this.searches);
  }

}
