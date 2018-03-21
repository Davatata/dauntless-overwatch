import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  // hide = true;
  @Input() opacity;
  @Input() zIndex;
  @Output() hide: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  hideRanks() {
    this.opacity = 0;
    this.zIndex = 0;
    this.hide.emit(null);
    // console.log('hide ranks', false,this.opacity, this.zIndex);
  }
}
