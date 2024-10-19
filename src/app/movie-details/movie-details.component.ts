import { Component, Inject } from '@angular/core';  // Import Angular core modules
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';  // Import Material dialog data and reference

/**
 * Component for displaying movie details.
 * 
 * This component shows detailed information about a specific movie,
 * including its name and description, and allows users to close the dialog.
 */
@Component({
  selector: 'app-movie-details',  // The component's selector used in HTML
  templateUrl: './movie-details.component.html',  // Path to the component's HTML template
  styleUrls: ['./movie-details.component.scss']  // Path to the component's styles
})
export class MovieDetailsComponent {
  movie: any;  // Variable to hold movie data

  /**
   * Creates an instance of MovieDetailsComponent.
   * 
   * @param {any} data - The data passed to the dialog, containing movie Name and Description.
   * @param {MatDialogRef<MovieDetailsComponent>} dialogRef - Reference to the dialog for closing it.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Name: string; Description: string },  // Receive movie data
    public dialogRef: MatDialogRef<MovieDetailsComponent>  // Reference to the dialog
  ) {}

  /**
   * Function to close the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();  // Close the dialog when called
  }
}
