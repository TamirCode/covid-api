// Dark mode set up before DOM loads
const HTML = document.documentElement;
const toggleThemeBtn = document.createElement("button");

if (localStorage.getItem("isDark") === null) {
    localStorage.setItem("isDark", "false");
	toggleThemeBtn.innerText = "Dark Mode"
} else if (localStorage.getItem("isDark") == "true") {
	HTML.classList.toggle("dark-mode");
	toggleThemeBtn.innerText = "Light Mode"
} else {
	toggleThemeBtn.innerText = "Dark Mode"
}

toggleThemeBtn.addEventListener("click", () => {
    HTML.classList.toggle("dark-mode");
	if (localStorage.getItem("isDark") == "false") {
		localStorage.setItem("isDark", "true");
		toggleThemeBtn.innerText = "Light Mode"
	} else {
		localStorage.setItem("isDark", "false");
		toggleThemeBtn.innerText = "Dark Mode"
	}
});