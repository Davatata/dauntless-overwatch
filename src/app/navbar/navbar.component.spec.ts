import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isOpen to false initially', () => {
    expect(component.isOpen).toEqual(false);
  });

  it('should toggle isOpen', () => {
    component.toggleOpen();
    expect(component.isOpen).toEqual(true);
    component.toggleOpen();
    expect(component.isOpen).toEqual(false);
  });
});
