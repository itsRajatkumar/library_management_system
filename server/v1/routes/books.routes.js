import { Router } from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  BorrowBook,
  returnBook,
  getAllBooksBorrowedByUser,
  getAllBooksWithBorrower,
  getStatics,
} from "../controllers/books.controllers.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const booksRouter = Router();

booksRouter.post("/add-book", checkAuth(["LIBRARIAN"]), (req, res) =>
  addBook(req, res)
);

booksRouter.get("/get-books", checkAuth(["LIBRARIAN", "MEMBER"]), (req, res) =>
  getAllBooks(req, res)
);

booksRouter.get(
  "/get-books/:id",
  checkAuth(["LIBRARIAN", "MEMBER"]),
  (req, res) => getBookById(req, res)
);

booksRouter.put("/update-book/:id", checkAuth(["LIBRARIAN"]), (req, res) =>
  updateBookById(req, res)
);

booksRouter.delete("/delete-book/:id", checkAuth(["LIBRARIAN"]), (req, res) =>
  deleteBookById(req, res)
);

booksRouter.post(
  "/borrow-book/:id",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => BorrowBook(req, res)
);

booksRouter.post(
  "/return-book/:id",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => returnBook(req, res)
);

booksRouter.get(
  "/get-books-borrowed-by-user/:id",
  checkAuth(["MEMBER", "LIBRARIAN"]),
  (req, res) => getAllBooksBorrowedByUser(req, res)
);

booksRouter.get(
  "/get-books-with-borrower",
  checkAuth(["LIBRARIAN"]),
  (req, res) => getAllBooksWithBorrower(req, res)
);

booksRouter.get("/get-stats", checkAuth(["LIBRARIAN"]), (req, res) =>
  getStatics(req, res)
);

export default booksRouter;
