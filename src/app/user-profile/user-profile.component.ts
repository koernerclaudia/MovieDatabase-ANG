
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
  id: string = ''; // Movie ID to be added to favorites
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
    public dialog: MatDialog,
   
  ) {
    this.userForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.getMovies()
    console.log('User data on init:', this.user);
  }


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

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Type,         
        Description: genre.Description
      },
      width: '500px'
    });
  }

  openDirectorDialog(Director: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: Director.Name,         
        Birthyear: Director.Birthyear
      },
      width: '500px'
    });
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Name: movie.Title,  
        Description: movie.Description
      },
      width: '500px'
    });
  }


  // isFavorite(movieId: string): boolean {
  //   return this.FavoriteMovies.includes(movieId);
  // }

    // Check if a movie is in the favorites
    isFavorite(movieId: string): boolean {
      return this.FavoriteMovies.some(movie => movie._id === movieId);
    }


  // Remove a movie from favorites
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
  

    // Update localStorage with the latest favorite movies list
    updateLocalStorageFavorites(): void {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.FavoriteMovies = this.FavoriteMovies.map(movie => movie._id);
      localStorage.setItem('user', JSON.stringify(user));
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

// Deregister account
async deleteAccount() {
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

      // // Await the HTTP delete request
      // await this.http
      //   .delete(`https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`, { headers, responseType: 'text' }) // Add responseType: 'text'
      //   .toPromise(); // Convert the Observable to a Promise

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


// Logs the user out of the system and sends them back to the welcome view
logoutUser(): void {
  localStorage.clear();
  this.router.navigate(['/welcome']); // routes to the 'movie-card' view
  this.snackBar.open("You've been logged out", 'OK', {
    duration: 2000,
    panelClass: ['custom-snackbar', 'mat-elevation-z4']
  });
}

}