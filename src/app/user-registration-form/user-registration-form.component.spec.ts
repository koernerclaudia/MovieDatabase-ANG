import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserRegistrationFormComponent } from './user-registration-form.component'; // Adjust the import path
import { FetchApiDataService } from '../fetch-api-data.service'; // Adjust the import path

describe('UserRegistrationFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      declarations: [UserRegistrationFormComponent],
      providers: [FetchApiDataService] // Ensure the service is provided
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(UserRegistrationFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
