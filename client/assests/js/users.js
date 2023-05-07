const getUsers = () => {
  fetch("http://localhost:3000/api/v1/auth/users", {
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
        const users = data.users;
        let output = "";
        users.forEach((user) => {
          output += `
                <tr>
                <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>
                            <button onClick="clickBorrowedBookHandler(${user.id})" class="btn btn__edit">View Borrowed Books</button>
                            <button onClick="clickUserEditHandler(${user.id})" class="btn btn__edit">Edit</button>
                            <button onClick="clickUserPasswordEditHandler(${user.id})" class="btn btn__edit btn_update">Update Password</button>
                            <button onClick="clickUserDeleteHandler(${user.id})" class="btn btn__delete">Delete</button>

                        </td>
                    </tr>`;
        });
        document.getElementById("usersTableBody").innerHTML = output;
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

const getUserDetails = (id) => {
  fetch(`http://localhost:3000/api/v1/auth/users/${id}`, {
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
        const user = data.user;
        document.getElementById("username").value = user.username;
        document.getElementById("role").value = user.role;
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

const deleteUser = (id) => {
  fetch(`http://localhost:3000/api/v1/auth/delete/${id}`, {
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
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

const updateUser = (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;

  const user = {
    username,
    role,
  };

  fetch(`http://localhost:3000/api/v1/auth/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.href = "users.html";
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

const updateUserPassword = (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const user = {
    password,
  };

  fetch(`http://localhost:3000/api/v1/auth/update-password/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.href = "users.html";
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

const changePasswordByUser = (e) => {
  e.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const user = {
    oldPassword,
    newPassword: password,
  };

  fetch(`http://localhost:3000/api/v1/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        window.location.reload();
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

// deleteAccount
const deleteAccount = (e) => {
  e.preventDefault();
  // get confirmation from user

  const confirmation = confirm("Are you sure you want to delete your account?");
  if (!confirmation) {
    return;
  }

  const password = document.getElementById("deletePassword").value;

  const user = {
    password,
  };

  fetch(
    `http://localhost:3000/api/v1/auth/delete-by-user/${localStorage.getItem(
      "userId"
    )}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.status) {
        localStorage.clear();
        console.log("exist");
        window.location.href = "/login.html";
      } else {
        alert(data.message || data.error);
      }
    })
    .catch((err) => console.log(err));
};

// handle books page
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("users.html") > -1) {
    getUsers();
  }
});

const clickUserDeleteHandler = (id) => {
  // get confirmation from the user
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (confirmDelete) {
    // delete user
    deleteUser(id);
  }
};

const clickUserEditHandler = (id) => {
  window.location.href = `update-user.html?id=${id}`;
};

const clickUserPasswordEditHandler = (id) => {
  window.location.href = `update-password.html?id=${id}`;
};

// handle user update page details
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("update-user.html") > -1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    getUserDetails(id);
  }
});

// handle user update page details
window.addEventListener("load", function () {
  console.log("Window loaded");
  if (window.location.href.indexOf("update-user.html") > -1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    getUserDetails(id);
  }
});

// handle user update page details
const updateHandler = document.getElementById("auth__update_form");
if (updateHandler) {
  updateHandler.addEventListener("submit", updateUser);
}

// handle user update page details
const updatePasswordHandler = document.getElementById(
  "auth__update_password_form"
);
if (updatePasswordHandler) {
  updatePasswordHandler.addEventListener("submit", updateUserPassword);
}

// handle borrowed books page
const clickBorrowedBookHandler = (id) => {
  window.location.href = `view-borrowed-books-by-user.html?id=${id}`;
};

// const changePasswordByUser = (e) => {
const changePasswordByUserHandler = document.getElementById(
  "auth__change_password_form"
);
if (changePasswordByUserHandler) {
  auth__change_password_form.addEventListener("submit", (e) => {
    changePasswordByUser(e);
  });
}

// const auth__delete_account_form = (e) => {
const deleteUserHandler = document.getElementById("auth__delete_account_form");
if (deleteUserHandler) {
  deleteUserHandler.addEventListener("submit", (e) => {
    deleteAccount(e);
  });
}
