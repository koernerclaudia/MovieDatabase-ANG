import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


const apiUrl = 'https://cmdb-b8f3cd58963f.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  // Headers with token for authenticated routes
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

    // User Registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  // User Login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  // Get all users
  public getAllUsers(): Observable<any> {
    return this.http.get(apiUrl + 'users', { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get user by username
  public getUser(username: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + username, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Update user details
  public updateUser(username: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + 'users/' + username, userDetails, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete a user
  public deleteUser(username: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + username, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  

  public isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  // Add movie to user’s favorites
  public addMovieToFavorites(username: string, movieID: string): Observable<any> {
    return this.http.post(apiUrl + `users/${username}/movies/${movieID}`, null, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Remove movie from user’s favorites
  public removeMovieFromFavorites(username: string, movieID: string): Observable<any> {
    return this.http.delete(apiUrl + `users/${username}/movies/${movieID}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movie by title
  public getMovieByTitle(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


    // Get movie by ID
    public getMovieByID(movieID: string): Observable<any> {
      return this.http.get(apiUrl + `movies/id/${movieID}`, { headers: this.getHeaders() }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

  // Get genre information
  public getGenre(genreType: string): Observable<any> {
    return this.http.get(apiUrl + `movies/genres/${genreType}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director information
  public getDirector(directorName: string): Observable<any> {
    return this.http.get(apiUrl + `movies/directors/${directorName}`, { headers: this.getHeaders() }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Response extraction
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError('Something went wrong; please try again later.');
  }


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





