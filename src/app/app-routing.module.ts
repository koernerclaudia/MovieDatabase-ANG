import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Define the application routes
const routes: Routes = [
  // You can define your routes here, for example:
  // { path: '', component: HomeComponent },
  // { path: 'movies', component: MovieListComponent },
  // { path: 'profile', component: UserProfileComponent },
  // { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for a 404 page
];

/**
 * AppRoutingModule is responsible for defining and configuring the routes for the application.
 * It uses the Angular Router to set up navigation within the application.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import the RouterModule with the defined routes
  exports: [RouterModule] // Export RouterModule to make it available throughout the application
})
export class AppRoutingModule { }
