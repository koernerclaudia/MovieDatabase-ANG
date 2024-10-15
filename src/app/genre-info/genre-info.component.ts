import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-info',
  templateUrl: './genre-info.component.html',
  styleUrls: ['./genre-info.component.scss']
})
export class GenreInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Name: string; Description: string },  // Receive genre data
    public dialogRef: MatDialogRef<GenreInfoComponent>
  ) {}

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}

