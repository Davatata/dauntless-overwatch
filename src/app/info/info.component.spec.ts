import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComponent } from './info.component';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on close', () => {
    component.hide.subscribe(e => {
      expect(e).toEqual(null);
    });
  });

  it('should reset opacity/zIndex', () => {
    expect(component.opacity).toEqual(undefined);
    expect(component.zIndex).toEqual(undefined);
    component.hideRanks();
    expect(component.opacity).toEqual(0);
    expect(component.zIndex).toEqual(-1);
  });
});
