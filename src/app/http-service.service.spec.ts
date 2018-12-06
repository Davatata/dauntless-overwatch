import { TestBed, async } from '@angular/core/testing';
import { HttpServiceService } from './http-service.service';

describe('AppComponent', () => {
  let service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [HttpServiceService]
    });
    service = TestBed.get(HttpServiceService);
  }));

});
