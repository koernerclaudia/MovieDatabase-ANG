import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; 
import { Router } from '@angular/router';
import { GenreInfoComponent } from '../genre-info/genre-info.component'; 
import { DirectorInfoComponent } from '../director-info/director-info.component'; 
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = []; // To hold filtered movies
  searchTerm: string = '';    // To store the search input
  FavoriteMovies: string[] = []; 
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  token: string = localStorage.getItem('token') || '';

  constructor(
    public fetchApiData: FetchApiDataService, 
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkLocalStorage();
    this.loadFavoritesFromLocalStorage();
    this.getMovies();
  }

  private checkLocalStorage() {
    if (typeof window !== 'undefined') {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.token = localStorage.getItem('token') || '';
      this.loadFavoritesFromLocalStorage();
    }
  }

  // Fetch all movies and initialize the filteredMovies array
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.filteredMovies = this.movies; // Initially, show all movies
    });
  }

  loadFavoritesFromLocalStorage(): void {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.FavoriteMovies = storedUser.FavoriteMovies || [];
  }

  // Function to filter movies based on searchTerm (title, actor, or director)
  filterMovies(): void {
    const searchTermLower = this.searchTerm.toLowerCase(); // Convert search term to lowercase

    this.filteredMovies = this.movies.filter(movie => {
      // Check if movie title, director name, or any actor name contains the search term
      return movie.Title.toLowerCase().includes(searchTermLower) ||
             movie.Director.Name.toLowerCase().includes(searchTermLower) ||
             movie.Actors.some((actor: string) => actor.toLowerCase().includes(searchTermLower));
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

  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);
    } else {
      this.addMovieToFavorites(movieId);
    }
  }

  isFavorite(movieId: string): boolean {
    return this.FavoriteMovies.includes(movieId);
  }

  addMovieToFavorites(movieId: string): void {
    if (!this.FavoriteMovies.includes(movieId)) {
      this.FavoriteMovies.push(movieId);
      this.fetchApiData.addMovieToFavorites(this.user.username, movieId).subscribe((response: any) => {
        this.updateLocalStorageFavorites();
      }, (error: any) => {
        console.error('Error adding movie to favorites:', error);
      });
    }
  }

  removeFromFavorites(movieId: string): void {
    this.fetchApiData.removeMovieFromFavorites(this.user.username, movieId).subscribe((response: any) => {
      const index = this.FavoriteMovies.indexOf(movieId);
      if (index > -1) {
        this.FavoriteMovies.splice(index, 1);
        this.updateLocalStorageFavorites();
      }
    });
  }

  updateLocalStorageFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.FavoriteMovies = this.FavoriteMovies;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
