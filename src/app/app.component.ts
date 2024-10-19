// src/app/app.component.ts
import { Component } from '@angular/core';

/**
 * The root component of the application.
 * This component serves as the main entry point for the Angular application.
 */
@Component({
  selector: 'app-root', // The selector used in the HTML template
  templateUrl: './app.component.html', // Path to the component's HTML template
  styleUrls: ['./app.component.scss'] // Path to the component's styles
})
export class AppComponent {
  title = 'CMDB-MovieDatabase-Angular'; // Title property for the application
}
