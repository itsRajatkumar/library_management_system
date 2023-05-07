// title VARCHAR(255) NOT NULL,
// author VARCHAR(255) NOT NULL,
// description VARCHAR(255),
// status VARCHAR(255) NOT NULL,

const ADD_BOOK_TO_DATABASE = (title, author, description) =>
  `INSERT INTO books (title, author, description, status, borrower_id) VALUES ("${title}", "${author}", "${description}", "AVAILABLE",null)`;

const GET_ALL_BOOKS = () => `SELECT * FROM books`;

const GET_BOOK_BY_ID = (id) => `SELECT * FROM books WHERE id = ${id}`;

const UPDATE_BOOK_BY_ID = (id, title, author, description, status) =>
  `UPDATE books SET title = "${title}", author = "${author}", description = "${description}", status = "${status}" WHERE id = ${id}`;

const DELETE_BOOK_BY_ID = (id) => `DELETE FROM books WHERE id = ${id}`;

const BORROW_BOOK_BY_ID = (id, borrower_id) =>
  `UPDATE books SET status = "BORROWED", borrower_id = ${borrower_id} WHERE id = ${id}`;

const RETURN_BOOK_BY_ID = (id) =>
  `UPDATE books SET status = "AVAILABLE", borrower_id = null WHERE id = ${id}`;

const GET_BOOKS_BY_BORROWER_ID = (id) =>
  `SELECT * FROM books WHERE borrower_id = ${id}`;

const GET_ALL_BOOKS_WITH_BORROWER = () =>
  `SELECT books.id, books.title, books.author, books.status, users.id as userID, users.username FROM books INNER JOIN users ON books.borrower_id = users.id`;

const GET_TOTAL_USER_COUNT_AND_BOOK_COUNT_AND_BORROWED_BOOK_COUNT = () =>
  `SELECT (SELECT COUNT(*) FROM users where role = "MEMBER" ) AS totalUsers, (SELECT COUNT(*) FROM books) AS totalBooks, (SELECT COUNT(*) FROM books WHERE status = "BORROWED") AS borrowedBooks`;

export {
  ADD_BOOK_TO_DATABASE,
  GET_ALL_BOOKS,
  GET_BOOK_BY_ID,
  UPDATE_BOOK_BY_ID,
  DELETE_BOOK_BY_ID,
  BORROW_BOOK_BY_ID,
  RETURN_BOOK_BY_ID,
  GET_BOOKS_BY_BORROWER_ID,
  GET_ALL_BOOKS_WITH_BORROWER,
  GET_TOTAL_USER_COUNT_AND_BOOK_COUNT_AND_BORROWED_BOOK_COUNT,
};
