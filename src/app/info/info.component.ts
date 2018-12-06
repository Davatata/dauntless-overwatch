import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  @Input() opacity;
  @Input() zIndex;
  @Output() hide: EventEmitter<any> = new EventEmitter();

  ranks = [
    { icon: 'bronze',      name: 'Bronze',      range: '1-1499 SR'},
    { icon: 'silver',      name: 'Silver',      range: '1500-1999 SR'},
    { icon: 'gold',        name: 'Gold',        range: '2000-2499 SR'},
    { icon: 'platinum',    name: 'Platinum',    range: '2500-2999 SR'},
    { icon: 'diamond',     name: 'Diamond',     range: '3000-3499 SR'},
    { icon: 'master',      name: 'Master',      range: '3500-3999 SR'},
    { icon: 'grandmaster', name: 'Grandmaster', range: '4000+'},
    { icon: 'top500',      name: 'Top 500',     range: 'Among the 500 best players in that region'}
  ];

  constructor() { }

  ngOnInit() {
  }

  hideRanks() {
    this.opacity = 0;
    this.zIndex = -1;
    this.hide.emit(null);
  }
}
