
# Online Tools Hub 🛠️

A collection of simple and useful web-based utility tools built with vanilla HTML, CSS, and JavaScript. This project currently includes a Screen Size Converter and a general Unit Converter.

**Live Demo:** [https://converterapp-ass2.onrender.com/](https://converterapp-ass2.onrender.com/)
*(Replace with your actual Render or deployment URL)*

---

## Features ✨

*   **Central Hub:** A main page (`index.html`) providing access to different tools via cards.
*   **Screen Size Converter (`converter.html`):**
    *   Calculates screen width, height, and diagonal in inches from centimeter inputs.
    *   Determines calculated diagonal (based on W/H) and allows using a measured diagonal for the final inch size.
    *   Calculates and displays Aspect Ratio (simplifying common ratios like 16:9, 4:3).
    *   Calculates and displays the screen area in cm² and inches².
    *   Multi-language support (French/English) with dynamic text updates.
    *   "Copy to Clipboard" buttons for easily grabbing calculated values.
    *   Input validation and user-friendly error messages.
    *   Reset button to clear inputs.
*   **Unit Converter (`unitconverter.html`):**
    *   Converts values between different units within categories.
    *   Supports categories: Length, Weight/Mass, Temperature.
    *   Dynamically updates available units based on the selected category.
    *   Handles linear conversions (e.g., meters to feet) and non-linear conversions (e.g., Celsius to Fahrenheit).
    *   Input validation and error display.
*   **Dark/Light Theme Toggle:** A persistent theme switcher (using `localStorage`) available on all pages.
*   **Responsive Design:** Basic responsiveness for usability on different screen sizes (ensure your CSS supports this well).

---

## Screenshots 📸

*(It's highly recommended to add screenshots here!)*

*   Replace this text with a screenshot of the Hub Page:
    `![Hub Page Screenshot](link/to/your/hub_screenshot.png)`
*   Replace this text with a screenshot of the Screen Converter:
    `![Screen Converter Screenshot](link/to/your/screen_converter_screenshot.png)`
*   Replace this text with a screenshot of the Unit Converter:
    `![Unit Converter Screenshot](link/to/your/unit_converter_screenshot.png)`

---

## Technologies Used 💻

*   **HTML5:** For structuring the web pages.
*   **CSS3:** For styling and layout (including CSS Variables for theming).
*   **JavaScript (ES6+):** For all application logic, DOM manipulation, calculations, and interactivity.
*   **(No external frameworks or libraries)** - Built purely with vanilla web technologies.

---

## Setup and Installation 🚀

This is a purely client-side application. No build process or server is required to run it locally.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Misaki-ux/converterapp.git
    ```
    *(Replace with your actual repository URL)*
2.  **Navigate to the project directory:**
    ```bash
    cd converterapp
    ```
3.  **Open the main hub page:**
    Simply open the `index.html` file in your preferred web browser.

That's it! You can now use the tools directly from your local files.

---

## Usage 🖱️

1.  Open `index.html` (the Hub page).
2.  Click on the card for the tool you want to use ("Screen Size Converter" or "Unit Converter").
3.  **For Screen Size Converter:**
    *   Enter the Width (L/W) and Height (H) in centimeters.
    *   Optionally, enter the measured diagonal in centimeters if known.
    *   Results (inches, aspect ratio, area) will update automatically.
    *   Use the language buttons (Fr/En) at the top to switch languages.
    *   Use the "Copy" buttons next to results to copy them to your clipboard.
    *   Use the "Reset" button to clear all inputs.
4.  **For Unit Converter:**
    *   Select the measurement `Category` (e.g., Length).
    *   Enter the `Value` you want to convert.
    *   Select the `From` unit and the `To` unit using the dropdowns.
    *   Click the `Convert` button.
    *   The result will be displayed below.
5.  **Theme Toggle:** Use the sun/moon toggle switch (usually in a corner) on any page to switch between light and dark modes. Your preference is saved locally.

---

## Contributing 🤝

Contributions, issues, and feature requests are welcome!

1.  Check for existing issues or open a new issue to discuss changes.
2.  Fork the repository (`git fork`).
3.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
4.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5.  Push to the branch (`git push origin feature/AmazingFeature`).
6.  Open a Pull Request.

---

## License 📄

*(Choose a license or state otherwise)*

This project is licensed under the MIT License - see the `LICENSE` file for details.

**OR**

This project is currently unlicensed.
