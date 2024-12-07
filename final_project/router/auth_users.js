const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username": "bob", "password": "pwd"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userMatches = users.some((user) => user.name === username);
return !userMatches;
}

// Validate credentials for users
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).send("Please input valid credentials");
    }

    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1hr" });
    req.session.user = { username, token };
    res.status(200).send("User successfully login");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const { username } = req.session.user;
    const isbn = req.params.isbn;
    const { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).send("Book not found. Please check isbn");
    }
    books[isbn].reviews[username] = review;
    res.status(200).send("Review added successfully");
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.user;
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).send("Book not found. Please check isbn");
    }
    if (!books[isbn].reviews[username]) {
        return res.status(404).send("Review not found. Please check");
    }
    delete books[isbn].reviews[username];
    res.status(200).send("Review deleted successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
