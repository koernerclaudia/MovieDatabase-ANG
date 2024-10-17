import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FetchApiDataService } from '../fetch-api-data.service';

describe('FetchApiDataService', () => {
  let service: FetchApiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Import HttpClientModule here
      providers: [FetchApiDataService]
    });
    service = TestBed.inject(FetchApiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
