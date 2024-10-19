import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * WelcomePageComponent displays the welcome page of the application.
 * It provides options for users to log in or register.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {

  /**
   * Creates an instance of WelcomePageComponent.
   * @param {MatDialog} dialog - The dialog service to open user registration and login dialogs.
   */
  constructor(public dialog: MatDialog) { }

  /**
   * Angular lifecycle hook that is called after the component is initialized.
   * Can be used for initialization logic if needed.
   */
  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  /**
   * Opens the user registration dialog.
   * Sets the width of the dialog to 280 pixels.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px' // Sets the width of the dialog
    });
  }

  /**
   * Opens the user login dialog.
   * Sets the width of the dialog to 280 pixels.
   */
  openUserLoginDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '280px' // Sets the width of the dialog
    });
  }
}
