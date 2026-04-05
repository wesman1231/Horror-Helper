# Horror Helper

Horror Helper is a site dedicated to helping new horror fans get their feet wet in the genre and hardcore horror hounds find their next deep cut watch. It's also a community to review and discuss your favorite horror films and shows.

## Description

Horror Helper allows users to search for horror films and shows by title and with in depth keyword filtering and sorting options to help fans find the exact experiences they're looking for. Horror fans all have their favorite themes and subgenres, and Horror Helper makes it easy to find whatever your heart desires, from slashers to zombies to found footage, anything and everything you can think of. You can also share your thoughts by creating an account and posting reviews.

## Architecture Overview

* Frontend: A Vite-powered React SPA utilizing TypeScript for type safety and React Router for navigation.

* Backend: A containerized Node.js/Express API connected to a MYSQL database storing movie data pulled from TMDB API and user reviews.

* Security: Identity management, session security, and email verification are handled via Auth0 with JWTs.

## Getting Started

## Installation

* Clone the repo by running ```git clone https://github.com/wesman1231/horror-helper.git```

* Install dependencies with ```npm install```

* Set up Auth0 SPA app and backend app

* Set environment variables for front end and back end (follow .env.example files)

* In the frontend directory run ```npm run dev``` to start the vite development server

* In the backend directory run ```docker-compose up --build``` to build and start the api and database

### Dependencies

* LIBRARIES:
    * Vite
    * Typescript
    * React
    * React Router
    * Node.js
    * Express.js
    * MYSQL (data pulled from tmdb API)
    * Auth0
    * Jest
    * Docker

## Authors

* Wesley Quirk
* wesquirk@gmail.com

## License

Copyright (c) 2026 Wesley Quirk. All Rights Reserved.
This project is for portfolio display purposes only. 
No part of this repository may be reproduced or distributed without 
express written permission from the author.