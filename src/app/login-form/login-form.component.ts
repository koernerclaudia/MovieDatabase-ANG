// src/app/user-registration-form/login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'] // Fixed from styleUrl to styleUrls
})
export class LoginFormComponent implements OnInit {

  @Input() userData = { username: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router // Fixed the constructor parentheses
  ) { }

  ngOnInit(): void {
  }



// This is the function responsible for sending the form inputs to the backend
loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe((result) => {
  // Logic for a successful user registration goes here! (To be implemented)
  localStorage.setItem("user", JSON.stringify(result.user));
  localStorage.setItem("token", result.token);
   // Log the values to check if they were set correctly
   console.log("User saved in localStorage:", JSON.parse(localStorage.getItem("user") || '{}'));
   console.log("Token saved in localStorage:", localStorage.getItem("token"));

   this.dialogRef.close(); // This will close the modal on success!

   this.snackBar.open("You are logged in!", 'OK', {
        duration: 3000
     });

     this.router.navigate(['movies']);

    }, (error) => {
      this.snackBar.open("Login unsuccessful, please try again!", 'OK', {
        duration: 3000
      });
    });
  }

}
