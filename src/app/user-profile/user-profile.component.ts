import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FetchApiDataService } from '../fetch-api-data.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  // user: any = null; // Initialize user
  movies: any[] = []; // Fetched movie list
  movie: any = {}; // Movie object to be added to favorites
  movieID: string = ''; // Movie ID to be added to favorites
  userForm: FormGroup;
  username: string = '';
  token: string = localStorage.getItem('token') || '';
  FavoriteMovies: any[] = []; // Array to hold user's favorite movies
  FavoriteMovieIDs: string[] = []; // Store only IDs of favorite movies

  
  constructor(
    private fetchApiData: FetchApiDataService, 
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
   
  ) {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.checkLocalStorage();
    console.log('local storage:', this.user);
    this.loadFavoriteMovies();
    console.log('User data on init:', this.user);
  }


  private checkLocalStorage() {
    // Only access localStorage in a browser environment
    if (typeof window !== 'undefined') {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.token = localStorage.getItem('token') || '';
      // this.loadFavoriteMovies(); // Load favorite movies if needed
    }
  }

  private loadFavoriteMovies() {
    const favorites = this.user.FavoriteMovies || []; // Use user object to get FavoriteMovies
    if (favorites && favorites.length > 0) {
      this.FavoriteMovieIDs = favorites; // Store IDs in an array
      this.fetchFavoriteMoviesDetails(); // Fetch movie details based on IDs
    }
  }

  private fetchFavoriteMoviesDetails() {
    const movieRequests = this.FavoriteMovieIDs.map(id => this.fetchApiData.getMovieByTitle(this.movie.Title)); // Using id directly
    Promise.all(movieRequests).then(movies => {
        this.FavoriteMovies = movies; // Assign the fetched movies
        console.log('Fetched favorite movies:', this.FavoriteMovies);
    }).catch(error => {
        console.error('Error fetching favorite movies:', error);
    });
}


  // Update user profile
updateProfile() {
  const updatedUser: any = {};

  // Collect form data to update profile fields
  if (this.userForm.get('username')?.value) {
    updatedUser.username = this.userForm.get('username')?.value;
  }
  if (this.userForm.get('password')?.value) {
    updatedUser.password = this.userForm.get('password')?.value;
  }
  if (this.userForm.get('email')?.value) {
    updatedUser.email = this.userForm.get('email')?.value;
  }
   // Check if the user has favorite movies and display them
  //  if (this.user.FavoriteMovies && this.user.FavoriteMovies.length > 0) {
  //   this.displayFavoriteMovies(this.user.FavoriteMovies);
  // }

  // If no fields are updated, show a message
  if (!Object.keys(updatedUser).length) {
    this.snackBar.open('Please update at least one field.', 'Close', {
      duration: 3000,
      panelClass: ['custom-snackbar', 'mat-elevation-z4']
    });
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
  });

  // Make HTTP PUT request to update the user profile
  this.http
    .put(
      `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
      updatedUser,
      { headers }
    )
    .subscribe(
      (updatedUser: any) => {
        // Save updated user details
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(this.user));

        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar', 'mat-elevation-z4']
        });

      },
      (error) => {
        console.error(error);
        this.snackBar.open('Failed to update profile. Try again.', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar', 'mat-elevation-z4']
        });
      }
    );
}

 // Deregister account
async deleteAccount() {
  if (confirm('Are you sure you want to delete your account? You will be logged out and your data will be lost.')) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    console.log('Attempting to delete account for user:', this.user.username); // Log the username
    try {
      // Await the HTTP delete request
      await this.http
        .delete(`https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`, { headers })
        .toPromise(); // Convert the Observable to a Promise
        localStorage.clear();
        console.log('Account deletion successful. Logging out user.'); // Log success of account deletion

      // If the request is successful, log the user out
      this.logoutUser(); // Call logoutUser to handle logout
      console.log('User logged out successfully.'); // Log confirmation of logout
      this.snackBar.open('Account deleted successfully.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar', 'mat-elevation-z4']
      });

      this.router.navigate(['/signup']); // Redirect after logout
    } catch (error) {
      console.error('Error deleting account:', error); // Log the error message
      this.snackBar.open('Failed to delete account. Try again.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar', 'mat-elevation-z4']
      });
    }
  } else {
    console.log('Account deletion was cancelled by the user.'); // Log if user cancels
  }
    
}

// Logs the user out of the system and sends them back to the welcome view
logoutUser(): void {
  localStorage.clear();
  this.router.navigate(['welcome']); // routes to the 'movie-card' view
  this.snackBar.open("You've been logged out", 'OK', {
    duration: 2000,
    panelClass: ['custom-snackbar', 'mat-elevation-z4']
  });
}


removeFromFavorites(movieId: string): void {
  this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
    console.log('Movie removed from favorites:', response);  // Debugging log
    this.FavoriteMovies = this.FavoriteMovies.filter(movie => movie._id !== movieId); // Update local state
    this.updateLocalStorageFavorites();
  }, (error: any) => {
    console.error('Error removing movie from favorites:', error);  // Log error in case it fails
  });
}

updateLocalStorageFavorites(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Updated favorite movies in localStorage:', this.FavoriteMovies); // Debugging log
  user.FavoriteMovies = this.FavoriteMovies.map(movie => movie._id); // Update with current favorite movie IDs
  localStorage.setItem('user', JSON.stringify(user));
}
}



