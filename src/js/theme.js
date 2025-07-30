function setTheme(mode) {
  localStorage.setItem("theme_pref", mode);
  applyTheme(mode);
}
function applyTheme(mode) {
  if (mode === "system") {
    document.documentElement.classList.toggle(
      "dark",
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } else {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }
}
function getTheme() {
  return localStorage.getItem("theme_pref") || "system";
}
if (document.getElementById("themeSelector")) {
  applyTheme(getTheme());
  document.getElementById("themeSelector").value = getTheme();
  document.getElementById("themeSelector").onchange = (e) =>
    setTheme(e.target.value);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getTheme() === "system") applyTheme("system");
    });
}
