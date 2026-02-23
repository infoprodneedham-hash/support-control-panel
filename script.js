function setTheme(themeName) {
    document.body.className = themeName;
    // Optional: Save to local storage so it persists
    localStorage.setItem('userTheme', themeName);
}

// Load saved theme on startup
window.onload = () => {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
};