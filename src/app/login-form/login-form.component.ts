// src/app/user-registration-form/login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';  // Import Angular core modules
import { MatDialogRef } from '@angular/material/dialog';  // Import Material dialog reference to close the dialog
import { FetchApiDataService } from '../fetch-api-data.service';  // Import the API service for making HTTP calls
import { MatSnackBar } from '@angular/material/snack-bar';  // Import Material Snackbar for displaying notifications
import { Router } from '@angular/router';  // Import Angular Router for navigation

/**
 * Component for the user login form.
 * 
 * This component allows users to input their login credentials 
 * and handles the authentication process.
 */
@Component({
  selector: 'app-login-form',  // The component's selector used in HTML
  templateUrl: './login-form.component.html',  // Path to the component's HTML template
  styleUrls: ['./login-form.component.scss']  // Path to the component's styles
})
export class LoginFormComponent implements OnInit {

  @Input() userData = { username: '', password: '' };  // Input data for username and password

  /**
   * Creates an instance of LoginFormComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service for making API calls.
   * @param {MatDialogRef<LoginFormComponent>} dialogRef - Reference to the dialog for closing it.
   * @param {MatSnackBar} snackBar - Service for displaying snack bar notifications.
   * @param {Router} router - Service for navigation within the application.
   */
  constructor(
    public fetchApiData: FetchApiDataService,  // Injected API service for user login
    public dialogRef: MatDialogRef<LoginFormComponent>,  // Reference to the dialog
    public snackBar: MatSnackBar,  // SnackBar for notifications
    private router: Router  // Router for navigation
  ) { }

  /**
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  /**
   * Sends the form inputs to the backend for user authentication.
   * 
   * This method is responsible for submitting the user's credentials 
   * and handling the response from the server.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
      // Logic for a successful user login goes here
      localStorage.setItem("user", JSON.stringify(result.user));  // Store user information in local storage
      localStorage.setItem("token", result.token);  // Store token in local storage
      // Log the values to check if they were set correctly
      console.log("User saved in localStorage:", JSON.parse(localStorage.getItem("user") || '{}'));
      console.log("Token saved in localStorage:", localStorage.getItem("token"));

      this.dialogRef.close();  // Close the modal on success

      this.snackBar.open("You are logged in!", 'OK', { duration: 3000 });  // Show success notification

      this.router.navigate(['movies']);  // Navigate to the movies page

    }, (error) => {
      this.snackBar.open("Login unsuccessful, please try again!", 'OK', { duration: 3000 });  // Show error notification
    });
  }
}
