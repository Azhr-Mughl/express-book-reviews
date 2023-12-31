const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'Azhar', password: 'azhar123' }
];

const isValid = (username) => { //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "your_secret_key");


    res.status(200).json("Customer logged In");

    // return res.status(300).json({ message: "Yet to be implemented_login" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (books[isbn]) {
        books[isbn].reviews['Azhar-M'] = review;

        return res.status(200).json(books[isbn]);
    } else {
        // If the ISBN is not found, respond with a 404 error
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Check if the ISBN exists in the books data
    if (books[isbn]) {
        // Check if the user has a review for the book
        if (books[isbn].reviews["Azhar-M"]) {
            // Delete the user's review for the book
            delete books[isbn].reviews["Azhar-M"];

            // Respond with the updated book data (excluding the deleted review)
            return res.status(200).json({ message: `Review for ISBN=${isbn} Posted by Azhar-M is Deleted` });
        } else {
            // If the user doesn't have a review, respond with a 404 error
            return res.status(404).json({ message: "Review not found for the given ISBN and user" });
        }
    } else {
        // If the ISBN is not found, respond with a 404 error
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
