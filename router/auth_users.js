const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

// Function to check if a user already exists
const userExists = (username) => {
  return users.some((user) => user.username === username);
};

// Function to register a new user
const registerUser = (username, password) => {
  if (userExists(username)) {
    return { success: false, message: "Username already exists" };
  }

  if (!username || !password) {
    return { success: false, message: "Username and password are required" };
  }

  const newUser = { username, password };
  users.push(newUser);
  return { success: true, message: "User registered successfully" };
};

// Route to register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  const registrationResult = registerUser(username, password);

  if (registrationResult.success) {
    res.status(201).json({ message: registrationResult.message });
  } else {
    res.status(400).json({ message: registrationResult.message });
  }
});
// Secret key for JWT
const secretKey = "your_secret_key";

// Route for user login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find the user based on the provided username
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  // User is authenticated; create a JWT token
  const token = jwt.sign({ username: user.username }, secretKey);

  res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.delete("/auth/review/:isbn", checkUserSession, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (bookReviews[isbn]) {
    const userReviews = bookReviews[isbn].filter(
      (review) => review.username === username
    );

    if (userReviews.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    bookReviews[isbn] = bookReviews[isbn].filter(
      (review) => review.username !== username
    );
    res.status(200).json({ message: "Review deleted successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
