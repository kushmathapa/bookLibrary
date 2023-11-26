const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username.length > 5;
};

const authenticatedUser = (username, password) => {
  return (
    users.filter((u) => {
      return u.username === username && u.password === password;
    }).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );

      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).send("User successfully logged in");
    } else
      return res
        .status(401)
        .json({ message: "Invalid grant. Username and password mismatch" });
  } else
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  let username = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (isbn != null) {
    let bookWithGivenIsbn = books[isbn];
    if (bookWithGivenIsbn) {
      if (
        !bookWithGivenIsbn.reviews ||
        typeof bookWithGivenIsbn.reviews !== "object"
      ) {
        bookWithGivenIsbn.reviews = {};
      }
      bookWithGivenIsbn.reviews[username] = review;
      res.status(200).json({
        message: "Book review added successfully for user:" + username,
      });
    } else
      return res.status(404).json({
        message: "Book with isbn: " + isbn + " is not available in our library",
      });
  } else return res.status(400).json({ message: "ISBN cannot be null" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (isbn != null) {
    let bookWithGivenIsbn = books[isbn];
    if (bookWithGivenIsbn) {
      let bookWithReview = bookWithGivenIsbn.reviews[username];
      if (bookWithReview) {
        delete bookWithGivenIsbn.reviews[username];
        res.status(200).json({
          message: "Book review deleted successfully for user:" + username,
        });
      } else
        return res
          .status(404)
          .json({ message: `Book review for user: ${username} not found` });
    } else
      return res.status(404).json({
        message: "Book with isbn: " + isbn + " is not available in our library",
      });
  } else return res.status(400).json({ message: "ISBN cannot be null" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
