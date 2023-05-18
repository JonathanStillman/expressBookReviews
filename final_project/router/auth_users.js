const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
	{
		username: "waleed",
		password: "waleed123",
	},
];

const isValid = (username) => {
	//returns boolean
	//write code to check if the username is valid
	let userIsValid = users.filter((user) => {
		return user.username === username;
	});
	return userIsValid.length === 0;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if the username and password match the ones we have in records.
	let authenticateUser = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	return authenticateUser.length > 0;
};

// Register a new user
regd_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Check if the username and password are provided
	if (!username || !password) {
		return res.status(400).json({ message: "Username and/or password missing." });
	}

	// Check if the username already exists
	if (!isValid(username)) {
		return res.status(409).json({ message: "Username already exists." });
	}

	// Add the new user to the users array
	users.push({ username: username, password: password });

	return res.status(200).json({ message: "User successfully registered!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const review = req.body.review;
	const username = req.session.authorization.username;

	if (books[isbn]) {
		let book = books[isbn];
		book.reviews[username] = review;
		return res.status(200).json({ message: "Review successfully posted" });
	}

	return res.status(404).json({ message: "Book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const username = req.session.authorization.username;

	if (books[isbn] && books[isbn].reviews[username]) {
		delete books[isbn].reviews[username];
		return res.status(200).json({ message: "Review successfully deleted" });
	}

	return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
