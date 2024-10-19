// src/app/user-registration-form/user-registration-form.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * This component displays the user registration form.
 * The selector defines the custom HTML element into which this component will render.
 * The Component decorator adds metadata to the class.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * The Input decorator defines the component’s input.
   * @type {{ username: string, password: string, email: string, Birthday: string }}
   */
  @Input() userData = { username: '', password: '', email: '', Birthday: '' };

  /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param {FetchApiDataService} fetchApiData - The service to fetch API data.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog opened.
   * @param {MatSnackBar} snackBar - The service to display notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  /**
   * This function is responsible for sending the form inputs to the backend.
   * It calls the userRegistration method from FetchApiDataService.
   * On success, it closes the dialog and shows a success message.
   * On failure, it shows an error message.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        console.log(result); // Log the result for debugging
        this.dialogRef.close(); // This will close the modal on success
        this.snackBar.open("You are signed up!", 'OK', {
          duration: 3000 // Duration for which the snackbar will be displayed
        });
      }, 
      (error) => {
        console.error('Sign up error:', error); // Log the error for debugging
        this.snackBar.open("Sign up failed, please try again", 'OK', {
          duration: 3000 // Duration for which the snackbar will be displayed
        });
      }
    );
  }
}
