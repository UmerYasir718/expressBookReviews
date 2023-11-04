const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Send the list of books as a JSON response
  res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Get the ISBN from the URL parameter
  const booksArray = Object.values(books);
  // Find the book with the specified ISBN
  const book = booksArray.find((b) => b.isbn === isbn);

  if (book) {
    // Book found, return its details
    res.status(200).json({ book });
  } else {
    // Book not found
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author; // Get the author from the URL parameter

  // Convert the books object into an array for easier filtering
  const booksArray = Object.values(books);

  // Find books with the specified author
  const matchingBooks = booksArray.filter((book) => book.author === author);

  if (matchingBooks.length > 0) {
    // Books by the author found, return their details
    res.status(200).json({ books: matchingBooks });
  } else {
    // No books by the author found
    res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title; // Get the title from the URL parameter

  // Convert the books object into an array for easier filtering
  const booksArray = Object.values(books);

  // Find books with the specified title
  const matchingBooks = booksArray.filter((book) => book.title === title);

  if (matchingBooks.length > 0) {
    // Books with the specified title found, return their details
    res.status(200).json({ books: matchingBooks });
  } else {
    // No books with the specified title found
    res.status(404).json({ message: "Books with this title not found" });
  }
});

//  Get book review
public_users.post("/review/:isbn", checkUserSession, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;
  const review = req.body.review;

  if (!bookReviews[isbn]) {
    bookReviews[isbn] = [];
  }

  const existingReviewIndex = bookReviews[isbn].findIndex(
    (r) => r.username === username
  );

  if (existingReviewIndex !== -1) {
    // Modify existing review
    bookReviews[isbn][existingReviewIndex].review = review;
    res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    bookReviews[isbn].push({ username, review });
    res.status(201).json({ message: "Review added successfully" });
  }
});
const getBooks = () => {
  return axios
    .get("https://api.example.com/books") // Replace with your API endpoint or data source
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const booksData = await getBooks();
    res.status(200).json({ books: booksData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});
const getBookByISBN = (isbn) => {
  return axios
    .get(`https://api.example.com/books/${isbn}`) // Replace with your API endpoint or data source
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const bookData = await getBookByISBN(isbn);
    res.status(200).json({ book: bookData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});
const getBooksByAuthor = (author) => {
  return axios
    .get(`https://api.example.com/books?author=${author}`) // Replace with your API endpoint or data source
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// Get book details based on Author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  try {
    const booksData = await getBooksByAuthor(author);
    res.status(200).json({ books: booksData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});
const getBooksByTitle = (title) => {
  return axios
    .get(`https://api.example.com/books?title=${title}`) // Replace with your API endpoint or data source
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

// Get book details based on Title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    const booksData = await getBooksByTitle(title);
    res.status(200).json({ books: booksData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});

module.exports.general = public_users;
