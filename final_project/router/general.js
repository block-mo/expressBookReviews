const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).send("Please input username and password");
    }
    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(400).send("Username already exists. Please choose another");
    }
    // Register the user
    users.push({ username, password });
    res.status(201).send("User successfully registered");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).send("Book not found. Please check isbn");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const result = Object.values(books).filter((book) => book.author === author);
    result.length ? res.json(result) : res.status(404).send("No books from this author");

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const result = Object.values(books).filter((book) => book.title === title);
    result.length ? res.json(result) : res.status(404).send("No books with this title");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.json(books[isbn].reviews);
        } else {
            res.status(404).send("Book review not found");
        }
});

module.exports.general = public_users;
