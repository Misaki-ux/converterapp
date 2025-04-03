// --- START OF FILE unitconverter_script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlTag = document.documentElement;
    const categorySelect = document.getElementById("categorySelect");
    const valueInput = document.getElementById("valueInput");
    const fromUnitSelect = document.getElementById("fromUnitSelect");
    const toUnitSelect = document.getElementById("toUnitSelect");
    const convertButton = document.getElementById("convertButton");
    const resultDisplay = document.getElementById("resultDisplay");
    const errorDisplay = document.getElementById("errorDisplay");

    // Language / Text Elements
    const pageTitle = document.getElementById('page-title');
    const backButton = document.getElementById('back-to-home');
    const labelCategory = document.getElementById('label-category');
    const labelValue = document.getElementById('label-value');
    const labelFrom = document.getElementById('label-from');
    const labelTo = document.getElementById('label-to');
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');
    const themeLabel = document.getElementById('theme-label'); // For theme toggle text

    // --- Language Data --- (VÉRIFIEZ ET COMPLÉTEZ CES TRADUCTIONS)
    const texts = {
        fr: {
            title: "Convertisseur d'Unités",
            backButton: "← Retour aux Outils",
            labelCategory: "Catégorie :",
            labelValue: "Valeur :",
            labelFrom: "De :",
            labelTo: "Vers :",
            placeholderValue: "Entrez la valeur à convertir",
            convertButtonText: "Convertir",
            resultPrefix: "Résultat :",
            themeLabel: "Mode Sombre",
            errorValue: "Veuillez entrer un nombre valide.",
            errorUnits: "Veuillez sélectionner les unités 'De' et 'Vers'.",
            errorConfig: "Catégorie non configurée.",
            errorFactors: "Facteurs d'unité non trouvés.",
            errorResult: "Le calcul a produit un résultat invalide.",
            errorLogic: "Logique de conversion non implémentée.",
            errorUnknown: "Erreur de calcul inconnue.",

            // Traductions des Catégories (clés = valeur des options HTML)
            categories: {
                length: "Longueur",
                weight: "Poids / Masse",
                temperature: "Température"
                // Ajoutez d'autres catégories si besoin
            },
            // Traductions des Unités (clés = noms utilisés dans l'objet conversions)
            units: {
                // Longueur
                Meters: "Mètres",
                Kilometers: "Kilomètres",
                Centimeters: "Centimètres",
                Millimeters: "Millimètres",
                Miles: "Miles",
                Feet: "Pieds",
                Inches: "Pouces",
                Yards: "Yards",
                // Poids
                Kilograms: "Kilogrammes",
                Grams: "Grammes",
                Milligrams: "Milligrammes",
                Pounds: "Livres",
                Ounces: "Onces",
                MetricTons: "Tonnes métriques",
                // Température
                Celsius: "Celsius",
                Fahrenheit: "Fahrenheit",
                Kelvin: "Kelvin"
                // Ajoutez d'autres unités si nécessaire
            }
        },
        en: {
            title: "Unit Converter",
            backButton: "← Back to Tools",
            labelCategory: "Category:",
            labelValue: "Value:",
            labelFrom: "From:",
            labelTo: "To:",
            placeholderValue: "Enter value to convert",
            convertButtonText: "Convert",
            resultPrefix: "Result:",
            themeLabel: "Dark Mode",
            errorValue: "Please enter a valid number for the value.",
            errorUnits: "Please select 'From' and 'To' units.",
            errorConfig: "Selected category is not configured.",
            errorFactors: "Unit factors not found for conversion.",
            errorResult: "Conversion resulted in an invalid number.",
            errorLogic: "Conversion logic for this category is not implemented.",
            errorUnknown: "Could not perform conversion.",

            // Category Translations (keys = HTML option values)
            categories: {
                length: "Length",
                weight: "Weight / Mass",
                temperature: "Temperature"
                 // Add other categories if needed
            },
            // Unit Translations (keys = names used in conversions object)
            units: {
                 // Length
                 Meters: "Meters",
                 Kilometers: "Kilometers",
                 Centimeters: "Centimeters",
                 Millimeters: "Millimeters",
                 Miles: "Miles",
                 Feet: "Feet",
                 Inches: "Inches",
                 Yards: "Yards",
                 // Weight
                 Kilograms: "Kilograms",
                 Grams: "Grams",
                 Milligrams: "Milligrams",
                 Pounds: "Pounds",
                 Ounces: "Ounces",
                 MetricTons: "Metric Tons",
                 // Temperature
                 Celsius: "Celsius",
                 Fahrenheit: "Fahrenheit",
                 Kelvin: "Kelvin"
                 // Add other units if needed
            }
        }
    };

    // --- Conversion Data ---
    const conversions = {
        length: { units: { Meters: 1, Kilometers: 0.001, Centimeters: 100, Millimeters: 1000, Miles: 0.000621371, Feet: 3.28084, Inches: 39.3701, Yards: 1.09361 }, base: "Meters" },
        weight: { units: { Kilograms: 1, Grams: 1000, Milligrams: 1000000, Pounds: 2.20462, Ounces: 35.274, MetricTons: 0.001 }, base: "Kilograms" },
        temperature: {
            units: ["Celsius", "Fahrenheit", "Kelvin"], // Keys used for lookup in texts.units
            convert: function(value, from, to) {
                if (from === to) return value;
                let celsiusValue;
                switch (from) {
                    case "Celsius": celsiusValue = value; break;
                    case "Fahrenheit": celsiusValue = (value - 32) * 5 / 9; break;
                    case "Kelvin": celsiusValue = value - 273.15; break;
                    default: return NaN;
                }
                let resultValue;
                switch (to) {
                    case "Celsius": resultValue = celsiusValue; break;
                    case "Fahrenheit": resultValue = (celsiusValue * 9 / 5) + 32; break;
                    case "Kelvin": resultValue = celsiusValue + 273.15; break;
                    default: return NaN;
                }
                return resultValue;
            }
        }
        // Add more categories here if needed
    };


    // --- Helper Functions ---
    function getCurrentLang() { return htmlTag.lang || 'en'; } // Default to English

    function clearResultAndError() {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        resultDisplay.textContent = currentTexts.resultPrefix + " "; // Set prefix based on lang
        errorDisplay.textContent = "";
        errorDisplay.style.display = "none";
    }

    function displayError(errorKey) {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        const message = currentTexts[errorKey] || currentTexts.errorUnknown; // Use error key or fallback
        errorDisplay.textContent = message;
        errorDisplay.style.display = "block";
        resultDisplay.textContent = currentTexts.resultPrefix + " "; // Clear result text, keep prefix
    }

    // --- Core Functions ---
    function updateTexts(lang) {
        lang = texts[lang] ? lang : 'en'; // Validate language, default to English
        htmlTag.lang = lang;
        const currentTexts = texts[lang];

        // Update static text elements
        if (pageTitle) pageTitle.textContent = currentTexts.title;
        document.title = currentTexts.title;
        if (backButton) backButton.textContent = currentTexts.backButton;
        if (labelCategory) labelCategory.textContent = currentTexts.labelCategory;
        if (labelValue) labelValue.textContent = currentTexts.labelValue;
        if (labelFrom) labelFrom.textContent = currentTexts.labelFrom;
        if (labelTo) labelTo.textContent = currentTexts.labelTo;
        if (valueInput) valueInput.placeholder = currentTexts.placeholderValue;
        if (convertButton) convertButton.textContent = currentTexts.convertButtonText;
        if (themeLabel) themeLabel.textContent = currentTexts.themeLabel;

        // Translate category dropdown options
        if (categorySelect && currentTexts.categories) {
            const options = categorySelect.options;
            for (let i = 0; i < options.length; i++) {
                const optionValue = options[i].value; // "length", "weight", etc.
                options[i].textContent = currentTexts.categories[optionValue] || options[i].textContent; // Use translation or original
            }
        }

        // Update language button states
        if (btnFr) { btnFr.classList.toggle('active', lang === 'fr'); btnFr.setAttribute('aria-pressed', lang === 'fr'); }
        if (btnEn) { btnEn.classList.toggle('active', lang === 'en'); btnEn.setAttribute('aria-pressed', lang === 'en'); }

        // Update unit dropdowns (which will now use translated unit names)
        updateUnits();
    }


    function updateUnits() {
        const category = categorySelect.value;
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang]; // Get texts for the current language

        // Clear previous unit options and results/errors
        fromUnitSelect.innerHTML = "";
        toUnitSelect.innerHTML = "";
        clearResultAndError(); // Uses current language for prefix

        let unitList;
        // Determine the list of unit keys for the selected category
        if (category === "temperature") {
            unitList = conversions.temperature.units; // This is already an array of keys
        } else if (conversions[category] && conversions[category].units) {
            unitList = Object.keys(conversions[category].units); // Get keys like "Meters", "Kilograms"
        } else {
            console.error("Invalid category selected or category data missing:", category);
            displayError("errorConfig");
            return;
        }

        // Populate unit dropdowns using translated names
        unitList.forEach(unitKey => { // unitKey is "Meters", "Celsius", "Kilograms", etc.
            // Look up the translation for the unit key
            const translatedUnit = currentTexts.units[unitKey] || unitKey; // Use translation or the key itself as fallback

            // Create option for 'From' dropdown
            const optionFrom = document.createElement("option");
            optionFrom.value = unitKey; // The value remains the English key for logic
            optionFrom.textContent = translatedUnit; // The displayed text is translated
            fromUnitSelect.appendChild(optionFrom);

            // Create option for 'To' dropdown
            const optionTo = document.createElement("option");
            optionTo.value = unitKey; // The value remains the English key
            optionTo.textContent = translatedUnit; // The displayed text is translated
            toUnitSelect.appendChild(optionTo);
        });

        // Select different default units if possible for better UX
        if (fromUnitSelect.options.length > 1) {
            // Ensure the index is valid (cannot be higher than length - 1)
            toUnitSelect.selectedIndex = Math.min(1, fromUnitSelect.options.length - 1);
        }
    }


    function performConversion() {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        clearResultAndError(); // Start fresh with correct prefix

        const category = categorySelect.value;
        const valueStr = valueInput.value.trim();
        const fromUnit = fromUnitSelect.value; // Gets the English key ("Meters", "Celsius")
        const toUnit = toUnitSelect.value;   // Gets the English key
        let result;

        if (valueStr === "") return; // Exit if no value entered

        const value = parseFloat(valueStr);
        if (isNaN(value)) {
            displayError("errorValue");
            return;
        }
        // This check might be redundant if updateUnits always populates, but good safety check
        if (!fromUnit || !toUnit) {
            displayError("errorUnits");
            return;
        }

        try {
            // Perform conversion based on category, using English keys for logic
            if (category === "temperature") {
                result = conversions.temperature.convert(value, fromUnit, toUnit);
            } else if (conversions[category]?.units && conversions[category]?.base) { // Use optional chaining
                const categoryData = conversions[category];
                const fromFactor = categoryData.units[fromUnit];
                const toFactor = categoryData.units[toUnit];
                // Check if factors exist for the selected units
                if (typeof fromFactor === 'undefined' || typeof toFactor === 'undefined') {
                    throw new Error("errorFactors"); // Throw specific error key
                }
                const baseValue = fromFactor === 0 ? 0 : value / fromFactor; // Avoid division by zero
                result = baseValue * toFactor;
            } else {
                // If category exists but logic is missing
                throw new Error("errorLogic"); // Throw specific error key
            }

            // Check if the conversion resulted in a valid number
            if (isNaN(result)) {
                throw new Error("errorResult"); // Throw specific error key
            }

            // Format and display the result
            const precision = (Math.abs(result) > 0.0001 || result === 0) ? 6 : 10; // Adjust precision
            const formattedResult = Number(result.toFixed(precision)); // Format number

            // Display result text - Uses English unit keys from variables fromUnit/toUnit
            // You could optionally translate these keys again using currentTexts.units if desired
             resultDisplay.textContent = `${currentTexts.resultPrefix} ${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
            // Example with translated units in result:
            // resultDisplay.textContent = `${currentTexts.resultPrefix} ${value} ${currentTexts.units[fromUnit] || fromUnit} = ${formattedResult} ${currentTexts.units[toUnit] || toUnit}`;


        } catch (error) {
            console.error("Conversion Error:", error);
            // Try to use the error message as key, otherwise default
            const errorKey = error instanceof Error && error.message.startsWith("error") ? error.message : "errorUnknown";
            displayError(errorKey);
        }
    } // --- End of performConversion ---

    // --- Event Listeners ---
    categorySelect.addEventListener("change", updateUnits); // Update units when category changes
    convertButton.addEventListener("click", performConversion); // Convert on button click
    btnFr.addEventListener('click', () => updateTexts('fr')); // Switch to French
    btnEn.addEventListener('click', () => updateTexts('en')); // Switch to English

    // Optional: Convert on Enter key press in the value input field
    valueInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission behavior
            performConversion();
        }
    });

    // --- Initial Setup ---
    // Determine initial language (Stored > Browser > Default 'en')
    const initialLang = localStorage.getItem('unitConverterLang') || navigator.language.split('-')[0] || 'en';
    updateTexts(initialLang); // Set up the UI with the determined language

    // Save language preference to localStorage when buttons are clicked
    btnFr.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'fr'));
    btnEn.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'en'));

}); // --- End of DOMContentLoaded ---
// --- END OF FILE unitconverter_script.js ---