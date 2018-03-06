import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HttpServiceService {

  constructor(private http: HttpClient) { }

  apiUrl:string = "https://owapi.net/api/v3/u/";
  dataType:string = "/stats";

  getStats(battleTag:string) {
    let tag = battleTag.split('#').join('-');
    console.log('getting: tag...');
    return this.http.get(this.apiUrl + tag + this.dataType).toPromise()
    .catch(error => {
      console.log(error);
    });
  }

  getSearches() {
    return localStorage.getItem("searches");
  }
  setSearches(searches) {
    localStorage.setItem('searches', searches);
  }
}
