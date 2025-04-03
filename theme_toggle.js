// theme_toggle.js
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('themeSwitch');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeSwitch) {
            themeSwitch.checked = (theme === 'dark');
        }
    }

    // Initialize theme based on localStorage or system preference
    if (currentTheme) {
        setTheme(currentTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light if no preference stored or detected
    }

    // Listener for the toggle switch
    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        });
    }

    // Optional: Listener for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only change if no theme explicitly set by user via toggle
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});