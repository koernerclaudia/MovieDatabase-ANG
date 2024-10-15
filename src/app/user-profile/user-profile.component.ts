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
  favoriteMovies: any[] = []; // Array to hold user's favorite movies
  
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
    this.getMovies();
    this.loadFavoriteMovies();
    console.log('User data on init:', this.user);

   
    
  }


  

   // Fetch all movies
   getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp; // Store all movies
      console.log('All Movies:', this.movies); // Debugging log
    }, error => {
      console.error('Error fetching all movies:', error);  // Catch errors if fetching fails
    });
  }


  // Update user profile
  updateProfile() {
    const updatedUser: any = {};
    if (this.userForm.get('username')?.value) {
      updatedUser.username = this.userForm.get('username')?.value;
    }
    if (this.userForm.get('password')?.value) {
      updatedUser.password = this.userForm.get('password')?.value;
    }
    if (this.userForm.get('email')?.value) {
      updatedUser.email = this.userForm.get('email')?.value;
    }

    if (!Object.keys(updatedUser).length) {
      this.snackBar.open('Please update at least one field.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .put(
        `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}`,
        updatedUser,
        { headers }
      )
      .subscribe(
        (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error(error);
          this.snackBar.open('Failed to update profile. Try again.', 'Close', {
            duration: 3000,
          });
        }
      );
  }


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
      });
      this.router.navigate(['/signup']); // Redirect after logout
    } catch (error) {
      console.error(error);
      this.snackBar.open('Failed to delete account. Try again.', 'Close', {
        duration: 3000,
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
  });
}


loadFavoriteMovies(): void {
  console.log('Fetching favorite movies for user:', this.user.username); // Debug: Log username
  if (this.user.username) {
    this.fetchApiData.getUserFavoriteMovies(this.user.username).subscribe((resp: any) => {
      this.favoriteMovies = this.movies.filter(movie => resp.includes(movie._id)); // Find full movie details from all movies
      console.log('Favorite Movies List with Details:', this.favoriteMovies);  // Debug: Check if favoriteMovies now has full movie objects
    }, error => {
      console.error('Error fetching favorite movies:', error);  // Catch errors if fetching fails
    });
  }
}



removeFromFavorites(movieId: string): void {
  this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
    console.log('Movie removed from favorites:', response);  // Debugging log
    this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId); // Update local state
    this.updateLocalStorageFavorites();
  }, (error: any) => {
    console.error('Error removing movie from favorites:', error);  // Log error in case it fails
  });
}

updateLocalStorageFavorites(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Updated favorite movies in localStorage:', this.favoriteMovies); // Debugging log
  user.FavoriteMovies = this.favoriteMovies.map(movie => movie._id); // Update with current favorite movie IDs
  localStorage.setItem('user', JSON.stringify(user));
}
}



// // Remove movie from favorites
// removeFavorite(movieId: string) {
//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${this.token}`,
//   });

//   this.http
//     .delete(
//       `https://cmdb-b8f3cd58963f.herokuapp.com/users/${this.user.username}/movies/${movieId}`,
//       { headers }
//     )
//     .subscribe(
//       (response) => {
//         this.FavoriteMovies = this.FavoriteMovies.filter(
//           (movie) => movie._id !== movieId
//         );
//         this.snackBar.open('Movie removed from favorites.', 'Close', {
//           duration: 3000,
//         });
//       },
//       (error) => {
//         console.error(error);
//         this.snackBar.open('Failed to remove movie.', 'Close', {
//           duration: 3000,
//         });
//       }
//     );
// }

  // // Load user's favorite movies from the API
  // loadUserFavorites(): void {
  //   if (this.user.username) {
  //     this.fetchApiData.getUserFavoriteMovies(this.user.username).subscribe((resp: any) => {
  //       this.FavoriteMovies = resp; // Assuming response is an array of movie IDs
  //       console.log('User Favorite Movies:', this.FavoriteMovies); // Debugging log
  //       this.filterFavoriteMovies(); // Filter movies based on favorites
  //     });
  //   }
  // }

  // // Filter movies to display only the user's favorites
  // filterFavoriteMovies(): void {
  //   this.FavoriteMovies = this.movies.filter(movie => 
  //     this.FavoriteMovies.includes(movie._id)
  //   );
  // }










  //   updateLocalStorageFavorites(): void {
  //   const updatedUser = { ...this.user, FavoriteMovies: this.FavoriteMovies };
  //   localStorage.setItem('user', JSON.stringify(updatedUser));
  // }