SuperNotes:

This application provides user authentication, face search, note management, and other functionalities.

Features:
User authentication (Signup and Login)
Face search for notes
Create, update, and delete notes
Profile management

Project Structure:

/SuperNotes
    /node_modules
    /public
        /scripts
        /styles
        Various HTML files for UI
    /routes
        - index.js (Contains all routes)
    /views
        - profile.ejs (Profile view)
        - update-note.ejs (Note update view)
    /models
        - User.js (User model)
        - Note.js (Note model)
    - app.js (Main server file)
    - package.json (Dependencies and scripts)
    - package-lock.json
    
Setup and Installation:

Prerequisites:
Node.js
MongoDB

Steps:
Clone the repository:

git clone https://github.com/Roy543/myapp.git
cd SuperNotes

Install the dependencies:

npm install
Start the MongoDB server.

Run the application:
node app.js

Visit http://localhost:3000 in your browser.

Usage
Signup or Login using the respective pages.
Once logged in, users can manage notes, perform face searches, and view their profile.
Users can also update and delete notes.

License
This project is licensed under the MIT License.

Contributors
Sahil Saspara