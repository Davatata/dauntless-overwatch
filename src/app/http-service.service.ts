import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpServiceService {

  constructor(private http: HttpClient) { }

  apiUrl = 'https://ow-api.com/v1/stats/pc/us/';
  dataType = '/complete';

  getStats(battleTag: string) {
    const tag = battleTag.split('#').join('-');
    // console.log(`getting: ${tag}`);
    // console.log(`getting: ${this.apiUrl + tag + this.dataType}`);
    return this.http.get(this.apiUrl + tag + this.dataType).toPromise();
  }

  getSearches() {
    return localStorage.getItem('searches');
  }

  setSearches(searches) {
    // console.log('setting localStorage');
    localStorage.setItem('searches', searches);
  }
}
