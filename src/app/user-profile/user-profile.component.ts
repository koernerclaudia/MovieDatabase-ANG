import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreInfoComponent } from '../genre-info/genre-info.component'; 
import { DirectorInfoComponent } from '../director-info/director-info.component'; 
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog'; 

/**
 * Component for managing the user profile, including viewing and updating user details,
 * and managing favorite movies.
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  
  user: any = JSON.parse(localStorage.getItem('user') || '{}'); // Current user data
  movies: any[] = []; // Fetched movie list
  movie: any = {}; // Movie object to be added to favorites
  movieID: string = ''; // Movie ID to be added to favorites
  id: string = ''; // Movie ID to be added to favorites
  userForm: FormGroup; // Reactive form for user profile updates
  username: string = ''; // Username of the current user
  token: string = localStorage.getItem('token') || ''; // Authentication token
  FavoriteMovies: any[] = []; // Array to hold user's favorite movies
  FavoriteMovieIDs: string[] = []; // Store only IDs of favorite movies

  /**
   * Creates an instance of UserProfileComponent.
   * @param {FetchApiDataService} fetchApiData - Service for API interactions.
   * @param {FormBuilder} fb - Service for building reactive forms.
   * @param {HttpClient} http - Service for making HTTP requests.
   * @param {MatSnackBar} snackBar - Service for displaying notifications.
   * @param {Router} router - Service for navigation between routes.
   * @param {MatDialog} dialog - Service for opening dialogs.
   */
  constructor(
    private fetchApiData: FetchApiDataService, 
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [''],
    });
  }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Fetches the movies and logs user data.
   */
  ngOnInit(): void {
    this.getMovies();
    console.log('User data on init:', this.user);
  }

  /**
   * Fetches the list of all movies and filters favorite movies for the user.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const FavoriteMovieIDs = storedUser.FavoriteMovies || [];

      this.FavoriteMovies = this.movies.filter((movie: any) => {
        return FavoriteMovieIDs.includes(movie._id);
      });
      return this.movies;
    });
  }

  /**
   * Opens a dialog to display genre information.
   * @param {any} genre - The genre object containing type and description.
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Type,         
        Description: genre.Description
      },
      width: '500px'
    });
  }

  /**
   * Opens a dialog to display director information.
   * @param {any} Director - The director object containing name and birth year.
   */
  openDirectorDialog(Director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: Director.Name,         
        Birthyear: Director.Birthyear
      },
      width: '500px'
    });
  }

  /**
   * Opens a dialog to display movie synopsis.
   * @param {any} movie - The movie object containing title and description.
   */
  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Name: movie.Title,  
        Description: movie.Description
      },
      width: '500px'
    });
  }

  /**
   * Checks if a movie is in the user's favorites.
   * @param {string} movieId - The ID of the movie to check.
   * @returns {boolean} True if the movie is a favorite; otherwise, false.
   */
  isFavorite(movieId: string): boolean {
    return this.FavoriteMovies.some(movie => movie._id === movieId);
  }

  /**
   * Removes a movie from the user's favorites.
   * @param {string} movieId - The ID of the movie to remove from favorites.
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
      const index = this.FavoriteMovies.findIndex(movie => movie._id === movieId);
      if (index > -1) {
        this.FavoriteMovies.splice(index, 1);
        this.updateLocalStorageFavorites();
       
        this.snackBar.open('Movie removed from favorites.', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar', 'mat-elevation-z4']
        });
        console.log(`Movie with ID: ${movieId} was removed from favorites.`);
      } else {
        this.snackBar.open('Movie not found in favorites.', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar', 'mat-elevation-z4']
        });
        console.log(`Movie with ID: ${movieId} was not found in favorites.`);
      }
    }, (error) => {
      console.error('Error removing movie from favorites:', error);
      this.snackBar.open('Failed to remove movie from favorites. Try again.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar', 'mat-elevation-z4']
      });
    });
  }

  /**
   * Updates local storage with the latest favorite movies list.
   */
  updateLocalStorageFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.FavoriteMovies = this.FavoriteMovies.map(movie => movie._id);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Updates the user profile with new details.
   */
  updateProfile(): void {
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

    console.log('Updated user data:', updatedUser);

    // If no fields are updated, show a message
    if (!Object.keys(updatedUser).length) {
      console.log('No fields were updated.');
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
          console.log('User profile successfully updated:', this.user);

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
          console.error('Error updating user profile:', error);
        }
      );
  }

  /**
   * Asks for confirmation and deletes the user account.
   */
  async deleteAccount(): Promise<void> {
    if (confirm('Are you sure you want to delete your account? You will be logged out and your data will be lost.')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });

      console.log('Attempting to delete account for user:', this.user.username); // Log the username

      try {
        const response = await this.http
          .delete(`https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`, { headers, responseType: 'text' }) // Add responseType: 'text'
          .toPromise(); // Convert the Observable to a Promise

        // Log the response from the server for debugging
        console.log('Response from server:', response); 

        localStorage.clear();
        console.log('Account deletion successful. Logging out user.'); // Log success of account deletion

        // If the request is successful, log the user out
        this.logoutUser(); // Call logoutUser to handle logout
        console.log('User logged out successfully.'); // Log confirmation of logout
        this.snackBar.open('Account deleted successfully.', 'Close', {
          duration: 3000,
          panelClass: ['custom-snackbar', 'mat-elevation-z4']
        });

        this.router.navigate(['/welcome']); // Redirect after logout
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

  /**
   * Logs the user out of the system and redirects them to the welcome view.
   */
  logoutUser(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']); // routes to the 'movie-card' view
    this.snackBar.open("You've been logged out", 'OK', {
      duration: 2000,
      panelClass: ['custom-snackbar', 'mat-elevation-z4']
    });
  }
}
