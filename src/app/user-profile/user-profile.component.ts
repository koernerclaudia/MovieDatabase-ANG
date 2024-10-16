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
  movies: any[] = []; // Fetched movie list
  movieID: string = ''; // Movie ID to be added to favorites
  userForm: FormGroup;
  username: string = '';
  token: string = localStorage.getItem('token') || '';
  FavoriteMovies: any[] = []; // Array to hold user's favorite movies
  
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
    // this.getMovies();
   
    this.loadFavoriteMovies();
    console.log('User data on init:', this.user);

   
    
  }


  

  //  // Fetch all movies
  //  getMovies(): void {
  //   this.fetchApiData.getAllMovies().subscribe((resp: any) => {
  //     this.movies = resp; // Store all movies
  //     console.log('All Movies:', this.movies); // Debugging log
  //   }, error => {
  //     console.error('Error fetching all movies:', error);  // Catch errors if fetching fails
  //   });
  // }


  // // Update user profile
  // updateProfile() {
  //   const updatedUser: any = {};
  //   if (this.userForm.get('username')?.value) {
  //     updatedUser.username = this.userForm.get('username')?.value;
  //   }
  //   if (this.userForm.get('password')?.value) {
  //     updatedUser.password = this.userForm.get('password')?.value;
  //   }
  //   if (this.userForm.get('email')?.value) {
  //     updatedUser.email = this.userForm.get('email')?.value;
  //   }

  //   if (!Object.keys(updatedUser).length) {
  //     this.snackBar.open('Please update at least one field.', 'Close', {
  //       duration: 3000,
  //     });
  //     return;
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${this.token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   this.http
  //     .put(
  //       `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
  //       updatedUser,
  //       { headers }
  //     )
  //     .subscribe(
  //       (updatedUser) => {
  //         this.user = updatedUser;
  //         localStorage.setItem('user', JSON.stringify(this.user));
  //         this.snackBar.open('Profile updated successfully!', 'Close', {
  //           duration: 3000,
  //         });
  //       },
  //       (error) => {
  //         console.error(error);
  //         this.snackBar.open('Failed to update profile. Try again.', 'Close', {
  //           duration: 3000,
  //         });
  //       }
  //     );
  // }

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

// // Method to display favorite movies
// displayFavoriteMovies(FavoriteMovies: string[]) {
//   // Logic to display the favorite movies in a component
//   // You could pass this to a template, store in a component variable, etc.
//   console.log('User favorite movies:', FavoriteMovies);
// }


 // Deregister account
async deleteAccount() {
  if (confirm('Are you sure you want to delete your account?')) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    try {
      // Await the HTTP delete request
      await this.http
        .delete(`https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`, { headers })
        .toPromise(); // Convert the Observable to a Promise

      // If the request is successful, log the user out
      this.logoutUser(); // Call logoutUser to handle logout
      this.snackBar.open('Account deleted successfully.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar', 'mat-elevation-z4']
      });
      this.router.navigate(['/signup']); // Redirect after logout
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to delete account. Try again.', 'Close', {
        duration: 3000,
        panelClass: ['custom-snackbar', 'mat-elevation-z4']
      });
    }
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


loadFavoriteMovies(): void {
  console.log('Fetching favorite movies for user:', this.user.username); // Debug: Log username
  if (this.user.username) {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.FavoriteMovies = this.movies.filter(movie => resp.includes(movie._id)); // Find full movie details from all movies
      console.log('Favorite Movies List with Details:', this.FavoriteMovies);  // Debug: Check if favoriteMovies now has full movie objects
    }, error => {
      console.error('Error fetching favorite movies:', error);  // Catch errors if fetching fails
    });
  }
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



