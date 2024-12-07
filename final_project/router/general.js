const express = require('express');
const axios = require('axios');
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
public_users.get('/', async (req, res) => {
  //Write your code here
  try {
    // Simulate fetching data - use external api if required
    const booksData = await new Promise((resolve) => 
        resolve(JSON.stringify(books, null, 4))
    );
    res.status(200).send(booksData);
  } catch (error) {
    res.status(500).json({error: "Failed to fetch book list"});
  }
});

// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  try {
    const bookDetails = await new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found. Please check isbn");
        }
    });
    res.status(200).send(bookDetails);
  } catch (error) {
    res.status(404).json({error});
  }
  // Same code without async/await
  /*
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).send("Book not found. Please check isbn");
  }
  */
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    //Write your code here
    const { author } = req.params;
    try {
        const booksAuthor = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter((book) => book.author === author);
        if (result.length > 0) {
            resolve(result);
        } else {
            reject("No books found by this author");
        }
    });
    res.status(200).send(booksAuthor);
    } catch (error) {
        res.status(404).json({ error });
    }
    
    // Same code as above without async/await
    /*
    const author = req.params.author;
    const result = Object.values(books).filter((book) => book.author === author);
    result.length ? res.json(result) : res.status(404).send("No books from this author");
    */
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    //Write your code here
    const { title } = req.params;
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter((book) => book.title === title);

            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found whith this title");
            }
        });
        res.status(200).send(booksByTitle);
    } catch (error) {
        res.status(404).json({error});
    }
    // Same as above without async/await using axios
    /*
    const title = req.params.title;
    const result = Object.values(books).filter((book) => book.title === title);
    result.length ? res.json(result) : res.status(404).send("No books with this title");
    */
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
