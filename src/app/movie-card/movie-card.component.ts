import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { GenreInfoComponent } from '../genre-info/genre-info.component'; // Import the GenreInfoComponent
import { DirectorInfoComponent } from '../director-info/director-info.component'; // Import the DirectorInfoComponent
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = []; // Store user's favorite movies
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    public fetchApiData: FetchApiDataService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadFavoritesFromLocalStorage();
    this.getMovies();
    this.loadUserFavorites(); // Load favorites from the API
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Load favorite movies from local storage
  loadFavoritesFromLocalStorage(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.favoriteMovies = storedUser.FavoriteMovies || [];
  }

  // Load user's favorite movies from the API
  loadUserFavorites(): void {
    if (this.user.username) {
      this.fetchApiData.getUserFavoriteMovies(this.user.username).subscribe((resp: any) => {
        this.favoriteMovies = resp; // Assuming the response is an array of movie IDs
        this.updateLocalStorageFavorites(); // Sync local storage
      });
    }
  }

  // Function to open Genre Info Dialog
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: genre.Type,         // Pass the genre name
        Description: genre.Description  // Pass the genre description
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

  /**
   * Opens a dialog to display movie synopsis about movie selected.
   * @param movie - The movie object.
   */


  openSynopsisDialog(movie: any): void {
    console.log('Movie Data:', movie);  // Log the movie object
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Name: movie.Title,  // Pass the title
        Description: movie.Description  // Pass the description
      },
      width: '500px'
    });
  }

  // Toggle favorite status of a movie
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);
    } else {
      this.addMovieToFavorites(movieId);
    }
  }

  // Check if a movie is in the user's list of favorite movies
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  // Add a movie to the user's favorites
  addMovieToFavorites(movieId: string): void {
    if (!this.favoriteMovies.includes(movieId)) {
      this.favoriteMovies.push(movieId);
      // Call the API to add the movie to favorites
      this.fetchApiData.addMovieToFavorites(this.user.username, movieId).subscribe((response: any) => {
        console.log('Movie added to favorites:', response);
        this.updateLocalStorageFavorites(); // Sync local storage
      }, (error: any) => {
        console.error('Error adding movie to favorites:', error);
      });
    }
  }

  // Remove a movie from the user's favorites
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
      const index = this.favoriteMovies.indexOf(movieId);
      if (index > -1) {
        this.favoriteMovies.splice(index, 1);
        this.updateLocalStorageFavorites(); // Sync local storage
        console.log('Movie removed from favorites:', response);
      }
    });
  }

  // Update local storage with current favorites
  updateLocalStorageFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.FavoriteMovies = this.favoriteMovies;
    localStorage.setItem('user', JSON.stringify(user));
  }
}