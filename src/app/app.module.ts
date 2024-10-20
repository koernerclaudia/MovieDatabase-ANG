// src/app/app.module.ts

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Angular Material modules for UI components
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardActions } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip'; // Import MatTooltipModule

// Importing components for the application
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { GenreInfoComponent } from './genre-info/genre-info.component';
import { DirectorInfoComponent } from './director-info/director-info.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NavBarComponent } from './navbar/navbar.component';
// import { MovieviewComponent } from './movieview/movieview.component';

// Define the routes for the application
const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: UserProfileComponent },
  // { path: 'movie-details/:title', component: MovieDetailsComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' }, // Redirect empty path to welcome
];

/**
 * Main application module.
 * This module defines the components, routes, and dependencies for the Angular application.
 */
@NgModule({
  declarations: [
    AppComponent, // Main app component
    UserRegistrationFormComponent, // User registration form component
    LoginFormComponent, // Login form component
    MovieCardComponent, // Movie card component
    WelcomePageComponent, // Welcome page component
    GenreInfoComponent, // Genre information component
    DirectorInfoComponent, // Director information component
    MovieDetailsComponent, // Movie details component
    NavBarComponent, // Navigation bar component
    UserProfileComponent, // User profile component
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Allows the use of custom elements
  ],

  exports: [RouterModule], // Export RouterModule for router functionalities
  imports: [
    BrowserModule, // Essential for any Angular app
    AppRoutingModule, // Import the routing module
    HttpClientModule, // Enable HTTP client features
    BrowserAnimationsModule, // Required for animations
    FormsModule, // For template-driven forms
    MatDialogModule, // For dialog features
    MatInputModule, // For input fields
    MatButtonModule, // For buttons
    MatCardModule, // For card UI elements
    MatCardActions, // For actions within cards
    MatFormFieldModule, // For form fields
    MatSnackBarModule, // For snack bar notifications
    MatIconModule, // For icons
    RouterModule.forRoot(appRoutes), // Set up the application routes
    ReactiveFormsModule, // For reactive forms
    MatTooltipModule, // For tooltips
  ],
  providers: [
    provideHttpClient(
      withFetch() // Enable fetch APIs
    ),
  ],
  bootstrap: [AppComponent], // Bootstrap the application with AppComponent
})
export class AppModule {}
