// function to get all books from the server
const getBooks = () => {
  fetch("http://localhost:3000/api/v1/books/get-books", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        console.log(data);
        const books = data.books;
        let output = "";
        const BooksTableHeader = document.getElementById("table_headings");
        BooksTableHeader.innerHTML = `
          <th>Book ID</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
            `;

        books.forEach((book) => {
          output += `
                                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.status}</td>
                        <td>
                           ${
                             localStorage.getItem("role") === "LIBRARIAN"
                               ? ` <button onClick="clickEditHandler(${book.id})" class="btn btn__edit">Edit</button>
                            <button onClick="clickDeleteHandler(${book.id})" class="btn btn__delete">Delete</button>`
                               : `<button onClick="clickViewHandler(${book.id})" class="btn btn__edit">View</button>`
                           }
                        </td>
                    </tr>`;
        });
        document.getElementById("booksTableBody").innerHTML = output;
      } else {
        alert(result.error || result.message);
      }
    })
    .catch((err) => console.log(err));
};

const getBooksWithBorrower = () => {
  fetch("http://localhost:3000/api/v1/books/get-books-with-borrower", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        console.log(data, "bowwer");
        const books = data.books;
        let output = "";
        const BooksTableHeader = document.getElementById("table_headings");
        console.log(BooksTableHeader);
        BooksTableHeader.innerHTML = `
            <th>Book ID</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Status</th>
              <th>Borrower ID</th>
              <th>Borrower Username</th>
              `;

        //   books.id, books.title, books.author, books.status, users.id as userID, users.username
        books.forEach((book) => {
          output += `
                                      <tr>
                          <td>${book.id}</td>
                          <td>${book.title}</td>
                          <td>${book.author}</td>
                          <td>${book.status}</td>
                          <td>${book.userID}</td>
                          <td>${book.username}</td>
                         
                      </tr>`;
        });
        document.getElementById("booksTableBody").innerHTML = output;
      } else {
        alert(result.error || result.message);
      }
    })
    .catch((err) => console.log(err));
};

// function to get book details from the server by id
const getBookDetails = (id) => {
  fetch(`http://localhost:3000/api/v1/books//get-books/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        console.log(data);
        const book = data.book;
        if (localStorage.getItem("role") === "LIBRARIAN") {
          document.getElementById("title").value = book.title;
          document.getElementById("author").value = book.author;
          document.getElementById("description").value = book.description;
        } else {
          const bookDetails = document.getElementById("View_book_components");
          bookDetails.innerHTML = `
                            <h2>Title: ${book.title}</h2>
                    <h3>Author: ${book.author}</h3>
                    <p><strong>Description:</strong> ${book.description}</p>

                    ${
                      localStorage.getItem("userId") == book.borrower_id
                        ? `<button onClick="clickReturnHandler(${book.id})" class="btn btn__edit">Return Book</button>`
                        : `<button ${
                            book.status == "BORROWED" ? "disabled" : ""
                          } onClick="clickBorrowHandler(${
                            book.id
                          })" class="btn btn__edit">Borrow Book</button>`
                    }
                    
                    `;
        }
      } else {
        alert(data.error || data.message);
      }
    })
    .catch((err) => console.log(err));
};

// function to add book to the server
const addBook = (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const description = document.getElementById("description").value;

  const book = {
    title,
    author,
    description,
  };

  fetch("http://localhost:3000/api/v1/books/add-book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        window.location.href = "books.html";
      } else {
        alert(result.error || result.message);
      }
      console.log(data);
    })
    .catch((err) => console.log(err));
};

// function to delete book
const deleteBook = (id) => {
  fetch(`http://localhost:3000/api/v1/books/delete-book/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.reload();
      } else {
        alert(data.error);
      }
    })
    .catch((err) => console.log(err));
};

// function to update book
const updateBook = (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const description = document.getElementById("description").value;

  const book = {
    title,
    author,
    description,
  };

  fetch(`http://localhost:3000/api/v1/books/update-book/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.href = "books.html";
      } else {
        alert("Error updating book");
      }
    })
    .catch((err) => console.log(err));
};

// function to get all books borrowed by a user
const getBooksBorrowedByUser = (id) => {
  fetch(`http://localhost:3000/api/v1/books/get-books-borrowed-by-user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        console.log(data);
        const books = data.books;
        let output = "";
        const url = window.location.href.split("/");

        const isMemberHome =
          window.location.href.indexOf("/member/") > -1 &&
          ((url[url.length - 2] === "member" && url[url.length - 1] === "") ||
            (url[url.length - 2] === "member" &&
              url[url.length - 1] === "index.html"));

        const booksHeader = document.getElementById("home_page_books_display");
        if (booksHeader) {
          booksHeader.innerHTML = `
            ${
              isMemberHome
                ? `   <th>Book ID</th>
                                <th>Book Name</th>
                                <th>Author</th>
                                <th>Status</th>`
                : `<th>Book ID</th>
                                <th>Book Name</th>
                                <th>Author</th>
                                `
            }
                                `;
        }
        books.forEach((book) => {
          output += `
                <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        ${
                          isMemberHome
                            ? `<td><button onClick="clickReturnHandler(${book.id})" class="btn btn__edit">Return Book</button></td>`
                            : ""
                        }
                    </tr>`;
        });
        if (books.length === 0) {
          output = `<tr><td colspan="4">No books borrowed</td></tr>`;
        }
        document.getElementById("borrowedbooksTableBody").innerHTML = output;
      } else {
        alert(data.error || data.message);
      }
    })
    .catch((err) => console.log(err));
};

const borrowBook = (id) => {
  fetch(`http://localhost:3000/api/v1/books/borrow-book/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.href = "books.html";
      } else {
        alert(result.error || result.message);
      }
    })
    .catch((err) => console.log(err));
};

const returnBook = (id) => {
  fetch(`http://localhost:3000/api/v1/books/return-book/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.href = "books.html";
      } else {
        alert(result.error || result.message);
      }
    })
    .catch((err) => console.log(err));
};

// get statistics
const getStatistics = () => {
  fetch(`http://localhost:3000/api/v1/books/get-stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        console.log(data);
        const stats = data.stats[0];
        document.getElementById("booksCount").innerHTML = stats.totalBooks;
        document.getElementById("usersCount").innerHTML = stats.totalUsers;
        document.getElementById("issuedBooksCount").innerHTML =
          stats.borrowedBooks;
      } else {
        alert(data.error || data.message);
      }
    })
    .catch((err) => console.log(err));
};

// Event Listeners

// handle add book page
const add_book_form = document.getElementById("add_book_form");
if (add_book_form) add_book_form.addEventListener("submit", addBook);

// handle books page
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("books.html") > -1) {
    console.log("Books page");
    getBooks();
  }
});

// handle user update page details
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("view-borrowed-books-by-user.html") > -1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);
    getBooksBorrowedByUser(id);
  }
});

// handle user update page details
window.addEventListener("load", function () {
  const url = window.location.href.split("/");
  console.log(url);
  if (
    window.location.href.indexOf("/member/") > -1 &&
    ((url[url.length - 2] === "member" && url[url.length - 1] === "") ||
      (url[url.length - 2] === "member" &&
        url[url.length - 1] === "index.html"))
  ) {
    getBooksBorrowedByUser(localStorage.getItem("userId"));
  }
});

// handle user update page details
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("member/view-book-details.html") > -1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);
    getBookDetails(id);
  }
});

// click delete handler
const clickDeleteHandler = (e) => {
  // get confirmation from user
  const confirmation = confirm("Are you sure you want to delete this book?");
  if (confirmation) {
    // delete book
    deleteBook(e);
  }
};

// click edit handler to navigate to update book page
const clickEditHandler = (e) => {
  console.log(e);
  window.location.href = `update-book.html?id=${e}`;
};

// handle books page
const clickViewHandler = (e) => {
  console.log(e);
  window.location.href = `view-book-details.html?id=${e}`;
};

// handle update book page
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("update-book.html") > -1) {
    console.log("update-book page");
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);
    getBookDetails(id);
  }
});

// update book handler
const update_book_form = document.getElementById("update_book_form");
if (update_book_form) update_book_form.addEventListener("submit", updateBook);

const viewBorrowerCheckBox = document.getElementById("view-borrower");
if (viewBorrowerCheckBox) {
  viewBorrowerCheckBox.addEventListener("change", function () {
    if (this.checked) {
      console.log("checked");
      getBooksWithBorrower();
    } else {
      console.log("unchecked");
      getBooks();
    }
  });
}

const clickBorrowHandler = (e) => {
  // get confirmation from user
  const confirmation = confirm("Are you sure you want to borrow this book?");
  if (confirmation) {
    console.log(e);
    borrowBook(e);
    // borrowBook(e);
  }
};

const clickReturnHandler = (e) => {
  // get confirmation from user
  const confirmation = confirm("Are you sure you want to return this book?");
  if (confirmation) {
    console.log(e);
    returnBook(e);
  }
};

// handle statistics page

// handle user update page details
window.addEventListener("load", function () {
  const url = window.location.href.split("/");
  console.log(url);
  if (
    window.location.href.indexOf("/librarian/") > -1 &&
    ((url[url.length - 2] === "librarian" && url[url.length - 1] === "") ||
      (url[url.length - 2] === "librarian" &&
        url[url.length - 1] === "index.html"))
  ) {
    getStatistics();
  }
});
