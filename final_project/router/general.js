const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "Customer already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register customer." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books: books });
});

// Get all books using async-await
public_users.get('/', async function (req, res) {
    try {
        const response = await books;
        return res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        // If found, return the book details
        const bookDetails = books[isbn];
        return res.status(200).json({ bookDetails });
    } else {
        // If not found, return a 404 error
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBookDetails(isbn)
        .then(book => {
            return res.status(200).json({ book });
        })
        .catch(error => {
            return res.status(500).json({ message: "Internal Server Error" });
        });
});

function getBookDetails(isbn) {
    return new Promise((resolve, reject) => {
        const book = booksData[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ response: { status: 404 } });
        }
    });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        // If found, return the list of books by the author
        return res.status(200).json({ booksByAuthor: booksByAuthor });
    } else {
        // If not found, return a 404 error
        return res.status(404).json({ message: "No books found for the given author" });
    }
});

// Get book details by Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getBookDetailsByAuthor(author)
        .then(book => {
            return res.status(200).json({ book });
        })
        .catch(error => {
            return res.status(500).json({ message: "Internal Server Error" });
        });
});

function getBookDetailsByAuthor(author) {
    return new Promise((resolve, reject) => {
        const book = booksData[author];
        if (book) {
            resolve(book);
        } else {
            reject({ response: { status: 404 } });
        }
    });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
        // If found, return the list of books by the author
        return res.status(200).json({ booksByTitle: booksByTitle });
    } else {
        // If not found, return a 404 error
        return res.status(404).json({ message: "No books found for the given title" });
    }
});

// Get book details by Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getBookDetailsByTitle(title)
        .then(book => {
            return res.status(200).json({ book });
        })
        .catch(error => {
            return res.status(500).json({ message: "Internal Server Error" });
        });
});

function getBookDetailsByTitle(title) {
    return new Promise((resolve, reject) => {
        const book = books[title];
        if (book) {
            resolve(book);
        } else {
            reject({ response: { status: 404 } });
        }
    });
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        // If found, return the book details
        const reviews = books[isbn].reviews;
        return res.status(200).json({ reviews });
    } else {
        // If not found, return a 404 error
        return res.status(404).json({ message: "Reviews not found for the given ISBN" });
    }
});

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.general = public_users;
