import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // <-- Import this
import { MovieCardComponent } from './movie-card.component';
import { FetchApiDataService } from '../fetch-api-data.service'; // Or wherever this service is located

describe('MovieCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieCardComponent ],
      imports: [ HttpClientModule ], // <-- Add this
      providers: [ FetchApiDataService ] // <-- Add any services your component depends on
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MovieCardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
