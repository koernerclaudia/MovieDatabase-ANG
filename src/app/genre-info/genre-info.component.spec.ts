import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GenreInfoComponent } from './genre-info.component';

describe('GenreInfoComponent', () => {
  let component: GenreInfoComponent;
  let fixture: ComponentFixture<GenreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenreInfoComponent ],
      imports: [ HttpClientTestingModule ] // Include HttpClientTestingModule for service
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch genre data on initialization', () => {
    const genreType = 'Action';  // Test case for genre type
    component.genreType = genreType;
    component.getGenreInfo();  // Call the method to fetch genre info
    fixture.detectChanges();
    expect(component.genre).toBeDefined();  // Check that genre is defined
  });
});



// ===========================

// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { GenreInfoComponent } from './genre-info.component';

// describe('GenreInfoComponent', () => {
//   let component: GenreInfoComponent;
//   let fixture: ComponentFixture<GenreInfoComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [GenreInfoComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(GenreInfoComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
