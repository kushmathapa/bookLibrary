const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const usernameNotAvailable = (username) => {
  return (
    users.filter((u) => {
      return u.username === username;
    }).length > 0
  );
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username) && !usernameNotAvailable(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User has been registered successfully." });
    }
    return res.status(429).json({ message: "Duplicate user" });
  }
  return res
    .status(400)
    .json({ message: "Please provide username and password" });
});

async function returnBookList(res) {
  let result = await res.send(JSON.stringify(books, null, 4));
  return result;
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  returnBookList(res);
});

async function returnBookListByIsbn(isbn, res) {
  const book = books[isbn];
  let result;
  if (book) result = await res.send(book);
  else
    result = await res
      .status(404)
      .json({ message: "Book with isbn " + isbn + " does not exist" });
  return result;
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  returnBookListByIsbn(isbn, res);
});

async function returnBookByAuthor(author, res) {
  const bookArray = Object.values(books); // Convert books object to an array
  const book = bookArray.filter((b) => b.author === author);
  let result;
  if (book.length > 0) result = await res.send(book);
  else
    result = await res
      .status(404)
      .json({ message: "Book with author: " + author + " does not exist" });
  return result;
}
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  returnBookByAuthor(author, res);
});

async function returnBookByTitle(title, res) {
  let result;
  const bookArray = Object.values(books); // Convert books object to an array
  const book = bookArray.filter((b) => b.title == title);
  if (book.length > 0) result = await res.send(book);
  else
    result = await res
      .status(404)
      .json({ message: "Book with title: " + title + " does not exist" });
  return result;
}
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  returnBookByTitle(title, res);
});

async function returnBookReviewByIsbn(isbn, res) {
  let result;
  const book = books[isbn];
  if (book) result = await res.send(book["reviews"]);
  else
    result = await res
      .status(404)
      .json({ message: "Book review for isbn " + isbn + " does not exist" });
  return result;
}

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  returnBookReviewByIsbn(isbn, res);
});

module.exports.general = public_users;
