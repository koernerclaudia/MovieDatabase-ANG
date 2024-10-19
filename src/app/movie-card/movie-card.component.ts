import { Component, OnInit } from '@angular/core';  // Import Angular core modules
import { FetchApiDataService } from '../fetch-api-data.service';  // Import service for making API calls
import { MatDialog } from '@angular/material/dialog';  // Import Material dialog for opening dialogs
import { Router } from '@angular/router';  // Import Angular Router for navigation
import { GenreInfoComponent } from '../genre-info/genre-info.component';  // Import genre info dialog component
import { DirectorInfoComponent } from '../director-info/director-info.component';  // Import director info dialog component
import { MovieDetailsComponent } from '../movie-details/movie-details.component';  // Import movie details dialog component

/**
 * Component representing a card for displaying movies.
 * 
 * This component fetches and displays movie data, allows searching and filtering,
 * and manages user favorite movies. It also handles opening dialogs for movie details,
 * genre information, and director information.
 */
@Component({
  selector: 'app-movie-card',  // The component's selector used in HTML
  templateUrl: './movie-card.component.html',  // Path to the component's HTML template
  styleUrls: ['./movie-card.component.scss']  // Path to the component's styles
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];  // Array to hold all movies
  filteredMovies: any[] = [];  // Array to hold filtered movies
  searchTerm: string = '';  // Variable to store the search input
  FavoriteMovies: string[] = [];  // Array to hold favorite movies
  user: any = JSON.parse(localStorage.getItem('user') || '{}');  // User data from local storage
  token: string = localStorage.getItem('token') || '';  // Token from local storage

  /**
   * Creates an instance of MovieCardComponent.
   * 
   * @param {FetchApiDataService} fetchApiData - Service for fetching movie data.
   * @param {MatDialog} dialog - Service for opening dialogs.
   * @param {Router} router - Service for navigation within the application.
   */
  constructor(
    public fetchApiData: FetchApiDataService,  // Injected API service for movie data
    public dialog: MatDialog,  // Dialog service for opening modal dialogs
    private router: Router  // Router service for navigation
  ) { }

  /**
   * Lifecycle hook that is called after the component has been initialized.
   * It checks local storage, loads favorites, and fetches movies.
   */
  ngOnInit(): void {
    this.checkLocalStorage();  // Check local storage for user data
    this.loadFavoritesFromLocalStorage();  // Load favorite movies from local storage
    this.getMovies();  // Fetch all movies
  }

  /**
   * Checks local storage for user data and token.
   */
  private checkLocalStorage() {
    if (typeof window !== 'undefined') {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');  // Get user data
      this.token = localStorage.getItem('token') || '';  // Get user token
      this.loadFavoritesFromLocalStorage();  // Load favorite movies
    }
  }

  /**
   * Fetches all movies and initializes the filteredMovies array.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;  // Store fetched movies
      this.filteredMovies = this.movies;  // Initially, show all movies
    });
  }

  /**
   * Loads favorite movies from local storage.
   */
  loadFavoritesFromLocalStorage(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');  // Get user data
    this.FavoriteMovies = storedUser.FavoriteMovies || [];  // Load favorite movies or initialize as empty
  }

  /**
   * Filters movies based on the search term.
   * 
   * This function filters the movies by title, director, or actor name based on the user input.
   */
  filterMovies(): void {
    const searchTermLower = this.searchTerm.toLowerCase();  // Convert search term to lowercase

    this.filteredMovies = this.movies.filter(movie => {
      // Check if movie title, director name, or any actor name contains the search term
      return movie.Title.toLowerCase().includes(searchTermLower) ||
             movie.Director.Name.toLowerCase().includes(searchTermLower) ||
             movie.Actors.some((actor: string) => actor.toLowerCase().includes(searchTermLower));
    });
  }

  /**
   * Opens a dialog to display genre information.
   * 
   * @param {any} genre - The genre data to display.
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
   * 
   * @param {any} Director - The director data to display.
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
   * 
   * @param {any} movie - The movie data to display.
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
   * Toggles the favorite status of a movie.
   * 
   * @param {string} movieId - The ID of the movie to toggle.
   */
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);  // Remove from favorites if already a favorite
    } else {
      this.addMovieToFavorites(movieId);  // Add to favorites if not already a favorite
    }
  }

  /**
   * Checks if a movie is in the favorites list.
   * 
   * @param {string} movieId - The ID of the movie to check.
   * @returns {boolean} True if the movie is a favorite, otherwise false.
   */
  isFavorite(movieId: string): boolean {
    return this.FavoriteMovies.includes(movieId);  // Check if the movie ID is in the favorites array
  }

  /**
   * Adds a movie to the favorites list.
   * 
   * @param {string} movieId - The ID of the movie to add to favorites.
   */
  addMovieToFavorites(movieId: string): void {
    if (!this.FavoriteMovies.includes(movieId)) {  // Check if the movie is not already a favorite
      this.FavoriteMovies.push(movieId);  // Add the movie ID to the favorites array
      this.fetchApiData.addMovieToFavorites(this.user.username, movieId).subscribe((response: any) => {
        this.updateLocalStorageFavorites();  // Update local storage with new favorites
      }, (error: any) => {
        console.error('Error adding movie to favorites:', error);  // Log any errors
      });
    }
  }

  /**
   * Removes a movie from the favorites list.
   * 
   * @param {string} movieId - The ID of the movie to remove from favorites.
   */
  removeFromFavorites(movieId: string): void {
    this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
      const index = this.FavoriteMovies.indexOf(movieId);  // Find the index of the movie ID
      if (index > -1) {
        this.FavoriteMovies.splice(index, 1);  // Remove the movie ID from the favorites array
        this.updateLocalStorageFavorites();  // Update local storage with new favorites
      }
    });
  }

  /**
   * Updates the local storage with the current favorites list.
   */
  updateLocalStorageFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  // Get user data from local storage
    user.FavoriteMovies = this.FavoriteMovies;  // Update user favorite movies
    localStorage.setItem('user', JSON.stringify(user));  // Save updated user data back to local storage
  }
}
