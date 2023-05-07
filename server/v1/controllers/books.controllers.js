import executeQuery from "../../db/executeQuery.js";
import {
  ADD_BOOK_TO_DATABASE,
  BORROW_BOOK_BY_ID,
  DELETE_BOOK_BY_ID,
  GET_ALL_BOOKS,
  GET_ALL_BOOKS_WITH_BORROWER,
  GET_BOOKS_BY_BORROWER_ID,
  GET_BOOK_BY_ID,
  GET_TOTAL_USER_COUNT_AND_BOOK_COUNT_AND_BORROWED_BOOK_COUNT,
  RETURN_BOOK_BY_ID,
  UPDATE_BOOK_BY_ID,
} from "../queries/books.queries.js";

const addBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;
    if (!title || !author) {
      return res
        .status(400)
        .json({ error: "Title and author are required", status: false });
    }
    const book = await executeQuery(
      ADD_BOOK_TO_DATABASE(title, author, description)
    );
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res
      .status(201)
      .json({ book, message: "Book Successfully added", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await executeQuery(GET_ALL_BOOKS());
    if (books.error) {
      return res.status(400).json({ error: books.error, status: false });
    }
    return res.status(200).json({ books, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await executeQuery(GET_BOOK_BY_ID(id));
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res.status(200).json({ book: book[0], status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const updateBookById = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, author, description, status } = req.body;
    const getBookById = await executeQuery(GET_BOOK_BY_ID(id));
    if (getBookById.error) {
      return res.status(400).json({ error: getBookById.error, status: false });
    }
    if (!getBookById[0]) {
      return res.status(400).json({ error: "Book not found", status: false });
    }
    if (!title) {
      title = getBookById[0].title;
    }
    if (!author) {
      author = getBookById[0].author;
    }
    if (!description) {
      description = getBookById[0].description;
    }
    if (!status) {
      status = getBookById[0].status;
    }
    const book = await executeQuery(
      UPDATE_BOOK_BY_ID(id, title, author, description, status)
    );
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res
      .status(200)
      .json({ message: "Book successfully updated", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const getBookById = await executeQuery(GET_BOOK_BY_ID(id));
    if (getBookById.error) {
      return res.status(400).json({ error: getBookById.error, status: false });
    }
    if (!getBookById[0]) {
      return res.status(400).json({ error: "Book not found", status: false });
    }
    if (getBookById[0]?.status === "BORROWED") {
      return res
        .status(400)
        .json({ error: "Cannot delete a borrowed book", status: false });
    }
    const book = await executeQuery(DELETE_BOOK_BY_ID(id));
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res
      .status(200)
      .json({ message: "Book successfully deleted", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const BorrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBookById = await executeQuery(GET_BOOK_BY_ID(id));
    if (getBookById.error) {
      return res.status(400).json({ error: getBookById.error, status: false });
    }
    if (!getBookById[0]) {
      return res.status(400).json({ error: "Book not found", status: false });
    }
    if (
      getBookById[0]?.status === "BORROWED" &&
      getBookById[0]?.borrower_id === req.user.id
    ) {
      return res
        .status(400)
        .json({ error: "Book already borrowed by you", status: false });
    }
    if (getBookById[0]?.status === "BORROWED") {
      return res
        .status(400)
        .json({ error: "Book already borrowed", status: false });
    }
    const book = await executeQuery(BORROW_BOOK_BY_ID(id, req.user.id));
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res
      .status(200)
      .json({ message: "Book successfully borrowed", status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const getBookById = await executeQuery(GET_BOOK_BY_ID(id));
    if (getBookById.error) {
      return res.status(400).json({ error: getBookById.error, status: false });
    }
    if (!getBookById[0]) {
      return res.status(400).json({ error: "Book not found", status: false });
    }
    if (getBookById[0]?.status === "AVAILABLE") {
      return res
        .status(400)
        .json({ error: "Book already returned", status: false });
    }
    const book = await executeQuery(RETURN_BOOK_BY_ID(id));
    if (book.error) {
      return res.status(400).json({ error: book.error, status: false });
    }
    return res
      .status(200)
      .json({ message: "Book successfully returned", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const getAllBooksBorrowedByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const books = await executeQuery(GET_BOOKS_BY_BORROWER_ID(id));
    if (books.error) {
      return res.status(400).json({ error: books.error, status: false });
    }
    return res.status(200).json({ books, status: true });
  } catch (error) {
    console.log(error);
    return res

      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const getAllBooksWithBorrower = async (req, res) => {
  try {
    const books = await executeQuery(GET_ALL_BOOKS_WITH_BORROWER());
    if (books.error) {
      return res.status(400).json({ error: books.error, status: false });
    }
    return res.status(200).json({ books, status: true });
  } catch (error) {
    console.log(error);
    return res

      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

const getStatics = async (req, res) => {
  try {
    const stats = await executeQuery(
      GET_TOTAL_USER_COUNT_AND_BOOK_COUNT_AND_BORROWED_BOOK_COUNT()
    );
    if (stats.error) {
      return res.status(400).json({ error: stats.error, status: false });
    }
    return res.status(200).json({ stats, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", status: false });
  }
};

export {
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
};
