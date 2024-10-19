import { Component, Inject } from '@angular/core';  // Import necessary Angular core modules
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';  // Import Material dialog data and reference

/**
 * Component representing the genre information dialog.
 * 
 * This component displays information about a genre, such as its name and description,
 * and provides a method to close the dialog.
 */
@Component({
  selector: 'app-genre-info',  // The component's selector used in HTML
  templateUrl: './genre-info.component.html',  // Path to the component's HTML template
  styleUrls: ['./genre-info.component.scss']  // Path to the component's styles
})
export class GenreInfoComponent {

  /**
   * Creates an instance of GenreInfoComponent.
   * 
   * @param {Object} data - The data injected into the dialog.
   * @param {string} data.Name - The name of the genre.
   * @param {string} data.Description - A brief description of the genre.
   * @param {MatDialogRef<GenreInfoComponent>} dialogRef - Reference to the dialog for controlling its state.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Name: string; Description: string },  // Inject data passed to the dialog
    public dialogRef: MatDialogRef<GenreInfoComponent>  // Reference to the dialog
  ) {}

  /**
   * Closes the dialog.
   * 
   * This method is called to close the dialog and remove it from view.
   */
  closeDialog(): void {
    this.dialogRef.close();  // Close the dialog using the dialog reference
  }
}
