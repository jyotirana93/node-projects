# Express Web server for serving static files and perform CRUD operations

Description:
This is a samll express server that

- Serves static files
- Dynamic Add,Update,Retrieve and Delete users using DOM manipulation
- Performs CRUD Operations on JSON data using file system module(no database)

---

## Home Page

![Index Page](https://github.com/jyotirana93/readme-images/blob/master/express_web_server_images/index-page.png?raw=true)

---

## Add Users Page

This page allows users to be created, updated, viewed and deleted using javascript and DOM manipulation with Backend that perform file base CRUD operations using file system in Node.js which manipulates JSON data and stores the profile images in asset folder(without using multer)

- Client Side

  - Uses vanilla Javascript to manipulate DOM
  - Dynamically updates and deletes the user list without reloading page

- Server Side

  - Handles incoming request to add, update, retrieve and delete users
  - stores user data in users.json file using Node.js file system module

![Add-User Page](https://github.com/jyotirana93/readme-images/blob/master/express_web_server_images/add-user-page.png?raw=true)

---
