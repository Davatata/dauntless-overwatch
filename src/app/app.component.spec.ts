import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { InfoComponent } from './info/info.component';
import { HttpServiceService } from './http-service.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PlayerStatsComponent,
        InfoComponent
      ],
      imports: [FormsModule, HttpClientModule],
      providers: [HttpServiceService]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
