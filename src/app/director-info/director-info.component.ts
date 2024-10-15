import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrls: ['./director-info.component.scss']
})
export class DirectorInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Name: string; Birthyear: string },  // Receive genre data
    public dialogRef: MatDialogRef<DirectorInfoComponent>
  ) {}

  // Function to close the dialog
  closeDialog(): void {
    this.dialogRef.close();
  }
}

