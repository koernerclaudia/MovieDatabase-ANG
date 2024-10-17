# CMDb (Claudia's Movie Database) built with Angular

WIP: Not yet fully functional (status: 17 Oct 2024)

## Project Details

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

This is my version of a frontend for a **movie database**; set up during my Full Stack Web Dev Training with [CareerFoundry](https://careerfoundry.com/en/courses/become-a-web-developer/). 

The project is supposed to demonstrate full-stack  development, including APIs (REST), web server
frameworks, databases, business logic, authentication, data security, and more.

### Tech Stack - MEAN - MongoDB, Express, Angular, NodeJS

## Backend:

Part 1 of this project dealt with setting up a **database and Rest API** from scratch to use as a backend - [Go here](https://github.com/koernerclaudia/CMDB) to find out more about...

**WIP: API Documentation:** https://cmdb-b8f3cd58963f.herokuapp.com/documentation.html

## Frontend:

The goal was to set up a single page application (SPA) and to build an app using one of the most renowned frameworks and libraries available today:
- **Angular** for frontend building in combination with 
- **Angular Material** (Sass, Css)
- **Angular WebPack** - as a build tool

## Features & Components:
- **Signup / Signup Screen:** Users can set up an account and get authenticated (username, password, email info will be necessary)
- **Login / Login Screen:** Users can log in and out; **Logout:** Available in link bar at all times
- **Browse & Search Movies View:** Users can browse movies + search movies by title, actor, director or genre
- **Dialog Windows** to open info about movie genre, director info and movie description
- **Favourite a Movie:** A user can favourite / unfavorite a movie. Favorite movies are listed in the user's profile view.
- **Update Profile/My Profile View:** Users can change their user information (either one: username, password, email address) and also de-register / delete their account completely


## Content Structure

The Database consists of 2 collections:
- Movies (Title, Movie Description, appearing actors; Genre + Description, Director + Year of birth )
- Users (Username, Password, Email)

## Live Project

- hosted on Netlify: https://cmdb-ang.netlify.app

## API Documentation

- available on Swagger here: https://cmdb-b8f3cd58963f.herokuapp.com/api-docs/


## Deployment

To build this app:

1) Fork the repository or download a Zip file form the main branch and extract.
2) Install Angular with this command or check the website for the latest... https://angular.dev/installation

```npm install -g @angular/cli```

3) Run 

```npm install````

4) Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. 

5) Build the app by running:

```ng build```

The build artifacts will be stored in the `dist/` directory.

6) Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Tools & resources used

Being new to Javascript (Typescript) I have used ChatGPT and Claude.ai to help build out components and get ideas for concepts. I have used AI mainly to structure the movie database information and build the JSON files for it.

## Licenses

This project is licensed under the MIT License.

## Training offers at Career Foundry

I am super thankful to have found this **Full Stack Web Dev Training** I am on with **CareerFoundry**. They provide a variety of trainings for digital careers. Go check them out!
https://careerfoundry.com/


# Frontend Twin built with REACT

This project has a frontend twin built with React. (MERN Stack)
https://github.com/koernerclaudia/CMDB-Live


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

