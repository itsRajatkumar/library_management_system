const loginUser = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = {
    username,
    password,
  };

  const response = await fetch(
    "https://library-management-system-lemon.vercel.app/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (result.status) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.role);
    localStorage.setItem("username", result.username);
    localStorage.setItem("userId", result.userId);

    if (result.role === "LIBRARIAN") window.location.href = "/librarian";
    else if (result.role === "MEMBER") window.location.href = "../member";
    else window.location.href = "/librarian/error.html";
  } else {
    alert(result.error || result.message);
  }
};

const signupUser = async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const data = {
    username,
    password,
    role,
  };

  const response = await fetch(
    "https://library-management-system-lemon.vercel.app/api/v1/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (result.status) {
    alert(result.error || result.message);
    window.location.href = "/librarian/login.html";
  } else {
    alert(result.error || result.message);
  }
};

const loginForm = document.getElementById("auth__login__form");
const signupForm = document.getElementById("auth__signup__form");

if (loginForm) loginForm.addEventListener("submit", loginUser);

if (signupForm) signupForm.addEventListener("submit", signupUser);
