import { Component, OnInit } from '@angular/core';  // Import Angular core modules
import { Router } from '@angular/router';  // Import Angular Router for navigation
import { MatSnackBar } from '@angular/material/snack-bar';  // Import Material Snackbar for notifications

/**
 * Component for the navigation bar.
 * 
 * This component provides navigation functionality for the application,
 * including a toggleable menu and user logout capabilities.
 */
@Component({
  selector: 'app-nav-bar',  // The component's selector used in HTML
  templateUrl: './navbar.component.html',  // Path to the component's HTML template
  styleUrls: ['./navbar.component.scss'],  // Path to the component's styles
})
export class NavBarComponent implements OnInit {
  menuOpen: boolean = false;  // Variable to track the state of the menu (open or closed)

  /**
   * Creates an instance of NavBarComponent.
   * 
   * @param {Router} router - Service for navigating between views in the application.
   * @param {MatSnackBar} snackBar - Service for displaying notifications to the user.
   */
  constructor(
    public router: Router,  // Injected Router service for navigation
    public snackBar: MatSnackBar  // Injected Snackbar service for displaying messages
  ) {}

  /**
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {}

  /**
   * Toggles the state of the menu between open and closed.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;  // Invert the current menu state
  }

  /**
   * Logs the user out of the system and navigates back to the welcome view.
   */
  logoutUser(): void {
    localStorage.clear();  // Clear local storage to remove user data
    this.router.navigate(['welcome']);  // Navigate to the welcome view
    this.snackBar.open("You've been logged out", 'OK', {  // Display logout notification
      duration: 2000,  // Duration for which the notification is visible
    });
  }
}
