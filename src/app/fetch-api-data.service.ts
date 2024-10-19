import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://cmdb-b8f3cd58963f.herokuapp.com/';

/**
 * Service for interacting with the API for user and movie management.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  /**
   * Creates an instance of FetchApiDataService.
   * @param {HttpClient} http - The HTTP client for making requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Returns the headers required for authenticated routes.
   * @returns {HttpHeaders} The headers containing the authorization token.
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  /**
   * Registers a new user.
   * @param {any} userDetails - The details of the user to be registered.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param {any} userDetails - The login credentials for the user.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all users.
   * @returns {Observable<any>} An observable containing the list of users.
   */
  public getAllUsers(): Observable<any> {
    return this.http.get(apiUrl + 'users', { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Observable<any>} An observable containing the user's details.
   */
  public getUser(username: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + username, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Updates the details of a user.
   * @param {string} username - The username of the user to be updated.
   * @param {any} userDetails - The updated details of the user.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public updateUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + 'users/' + username, userDetails, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user by their username.
   * @param {string} username - The username of the user to be deleted.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + username, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Checks if a movie is in the user's favorites.
   * @param {string} movieID - The ID of the movie to check.
   * @returns {boolean} True if the movie is a favorite; otherwise, false.
   */
  public isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  /**
   * Adds a movie to the user's favorites.
   * @param {string} username - The username of the user.
   * @param {string} movieID - The ID of the movie to add to favorites.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public addMovieToFavorites(username: string, movieID: string): Observable<any> {
    return this.http.post(apiUrl + `users/${username}/movies/${movieID}`, null, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the user's favorites.
   * @param {string} username - The username of the user.
   * @param {string} movieID - The ID of the movie to remove from favorites.
   * @returns {Observable<any>} An observable containing the response from the API.
   */
  public removeMovieFromFavorites(username: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}/movies/${movieID}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies.
   * @returns {Observable<any>} An observable containing the list of movies.
   */
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a movie by its title.
   * @param {string} title - The title of the movie to retrieve.
   * @returns {Observable<any>} An observable containing the movie details.
   */
  public getMovieByTitle(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a movie by its ID.
   * @param {string} movieId - The ID of the movie to retrieve.
   * @returns {Observable<any>} An observable containing the movie details.
   */
  getMovie(movieId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token to headers
    });
    return this.http.get<any>(apiUrl + `movies/${movieId}`, { headers });
  }

  /**
   * Retrieves a movie by its ID using a specific endpoint.
   * @param {string} movieID - The ID of the movie to retrieve.
   * @returns {Observable<any>} An observable containing the movie details.
   */
  public getMovieByID(movieID: string): Observable<any> {
    return this.http.get(apiUrl + `movies/id/${movieID}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves genre information based on the genre type.
   * @param {string} genreType - The genre type to retrieve information for.
   * @returns {Observable<any>} An observable containing the genre details.
   */
  public getGenre(genreType: string): Observable<any> {
    return this.http.get(apiUrl + `movies/genres/${genreType}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves director information based on the director's name.
   * @param {string} directorName - The name of the director to retrieve information for.
   * @returns {Observable<any>} An observable containing the director details.
   */
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `movies/directors/${directorName}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Extracts the response data from the HTTP response.
   * @param {any} res - The HTTP response.
   * @returns {any} The extracted response data.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * Handles HTTP errors.
   * @param {HttpErrorResponse} error - The error response from the HTTP request.
   * @returns {Observable<never>} An observable that contains an error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError('Something went wrong; please try again later.');
  }

  /**
   * Retrieves the favorite movies of the logged-in user.
   * @returns {Observable<any>} An observable containing the user's favorite movies.
   */
  public getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }
}
