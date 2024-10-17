import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // <-- Import this
import { LoginFormComponent } from './login-form.component';
import { FetchApiDataService } from '../fetch-api-data.service'; // Replace with correct path

describe('LoginFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // <-- Add HttpClientTestingModule here
      declarations: [LoginFormComponent],
      providers: [FetchApiDataService], // Add any required services if needed
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
