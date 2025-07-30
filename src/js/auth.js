const USER_KEY = "user_session";
const CREDENTIALS = {
  username: "admin",
  password: "password123",
  fullName: "Admin User",
  email: "admin@email.com",
};

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function isAuthenticated() {
  return !!getUser();
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "login.html";
}

// Login form
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").onsubmit = function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      saveUser(CREDENTIALS);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("error").textContent = "Invalid credentials";
      document.getElementById("error").classList.remove("hidden");
    }
  };
}

if (!window.location.pathname.endsWith("login.html") && !isAuthenticated()) {
  window.location.href = "login.html";
}

if (getUser()) {
  const user = getUser();
  if (document.getElementById("userName")) {
    document.getElementById("userName").textContent = user.fullName;
  }

  if (document.getElementById("userInitial")) {
    document.getElementById("userInitial").textContent = getInitials(
      user.fullName
    );
  }

  if (document.getElementById("profileInitial")) {
    document.getElementById("profileInitial").textContent = getInitials(
      user.fullName
    );
  }
}

if (document.getElementById("userMenuBtn")) {
  document.getElementById("userMenuBtn").onclick = function (e) {
    e.stopPropagation();
    const dropdown = document.getElementById("userDropdown");
    dropdown.classList.toggle("hidden");

    if (!dropdown.classList.contains("hidden")) {
      dropdown.style.opacity = "0";
      dropdown.style.transform = "translateY(-10px)";
      setTimeout(() => {
        dropdown.style.transition = "all 0.2s ease-out";
        dropdown.style.opacity = "1";
        dropdown.style.transform = "translateY(0)";
      }, 10);
    }
  };

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#userMenuBtn")) {
      const dropdown = document.getElementById("userDropdown");
      if (dropdown) {
        dropdown.classList.add("hidden");
      }
    }
  });
}
