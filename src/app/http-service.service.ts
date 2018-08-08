import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class HttpServiceService {

  constructor(private http: HttpClient) { }

  apiUrl:string = 'https://ow-api.com/v1/stats/pc/us/';
  dataType:string = '/complete';

  getStats(battleTag:string) {
    let tag = battleTag.split('#').join('-');
    console.log(`getting: ${tag}`);
    return this.http.get(this.apiUrl + tag + this.dataType).toPromise();
  }

  getSearches() {
    return localStorage.getItem("searches");
  }
  setSearches(searches) {
    localStorage.setItem('searches', searches);
  }
}
