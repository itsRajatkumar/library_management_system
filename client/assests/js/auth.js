const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/auth/login.html";
} else {
  const role = localStorage.getItem("role");
  if (role === "MEMBER" && !window.location.href.includes("member")) {
    window.location.href = "/member";
  }
  if (role === "LIBRARIAN" && !window.location.href.includes("librarian")) {
    window.location.href = "/librarian";
  }
}

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth/login.html";
};

const logoutBtn = document.getElementById("logout_button");

if (logoutBtn) logoutBtn.addEventListener("click", logout);
