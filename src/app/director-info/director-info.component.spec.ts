import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectorInfoComponent } from './director-info.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('MovieDetailsComponent', () => {
  let component: DirectorInfoComponent;
  let fixture: ComponentFixture<DirectorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorInfoComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Mock MatDialogRef if needed
        { provide: MAT_DIALOG_DATA, useValue: { /* provide your mock data here */ } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
