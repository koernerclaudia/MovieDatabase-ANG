import { Component, Inject } from '@angular/core';  // Import necessary Angular core modules
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';  // Import Material dialog data and reference

/**
 * Component representing the director information dialog.
 * 
 * This component displays information about a director, such as their name and birth year,
 * and provides a method to close the dialog.
 */
@Component({
  selector: 'app-director-info',  // The component's selector used in HTML
  templateUrl: './director-info.component.html',  // Path to the component's HTML template
  styleUrls: ['./director-info.component.scss']  // Path to the component's styles
})
export class DirectorInfoComponent {
  
  /**
   * Creates an instance of DirectorInfoComponent.
   * 
   * @param {Object} data - The data injected into the dialog.
   * @param {string} data.Name - The name of the director.
   * @param {string} data.Birthyear - The birth year of the director.
   * @param {MatDialogRef<DirectorInfoComponent>} dialogRef - Reference to the dialog for controlling its state.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { Name: string; Birthyear: string },  // Inject data passed to the dialog
    public dialogRef: MatDialogRef<DirectorInfoComponent>  // Reference to the dialog
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
