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

    // --- Language Data --- (COMPLÉTEZ AVEC VOS TRADUCTIONS)
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
            // Error Messages
            errorValue: "Veuillez entrer un nombre valide.",
            errorUnits: "Veuillez sélectionner les unités 'De' et 'Vers'.",
            errorConfig: "Catégorie non configurée.",
            errorFactors: "Facteurs d'unité non trouvés.",
            errorResult: "Le calcul a produit un résultat invalide.",
            errorLogic: "Logique de conversion non implémentée.",
            errorUnknown: "Erreur de calcul inconnue."
            // Note: Unit names (Meters, Celsius...) are usually kept in English
            // but could be translated here if needed and accessed in updateUnits.
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
            // Error Messages
            errorValue: "Please enter a valid number for the value.",
            errorUnits: "Please select 'From' and 'To' units.",
            errorConfig: "Selected category is not configured.",
            errorFactors: "Unit factors not found for conversion.",
            errorResult: "Conversion resulted in an invalid number.",
            errorLogic: "Conversion logic for this category is not implemented.",
            errorUnknown: "Could not perform conversion."
        }
    };

    // --- Conversion Data (No changes needed here for language) ---
    const conversions = {
        length: { units: { Meters: 1, Kilometers: 0.001, Centimeters: 100, Millimeters: 1000, Miles: 0.000621371, Feet: 3.28084, Inches: 39.3701, Yards: 1.09361 }, base: "Meters" },
        weight: { units: { Kilograms: 1, Grams: 1000, Milligrams: 1000000, Pounds: 2.20462, Ounces: 35.274, MetricTons: 0.001 }, base: "Kilograms" },
        temperature: {
            units: ["Celsius", "Fahrenheit", "Kelvin"],
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
    };

    // --- Helper Functions ---

    function getCurrentLang() {
        return htmlTag.lang || 'en'; // Default to English if not set
    }

    function clearResultAndError() {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        resultDisplay.textContent = currentTexts.resultPrefix + " "; // Set prefix based on lang
        errorDisplay.textContent = "";
        errorDisplay.style.display = "none";
    }

    // Now accepts an error key to look up the message
    function displayError(errorKey) {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        const message = currentTexts[errorKey] || currentTexts.errorUnknown; // Fallback message

        errorDisplay.textContent = message;
        errorDisplay.style.display = "block";
        resultDisplay.textContent = currentTexts.resultPrefix + " "; // Clear result text, keep prefix
    }

    // --- Core Functions ---

    // Update UI Text based on language
    function updateTexts(lang) {
        lang = texts[lang] ? lang : 'en'; // Validate lang, default to 'en'
        htmlTag.lang = lang;
        const currentTexts = texts[lang];

        // Update static text elements
        pageTitle.textContent = currentTexts.title;
        document.title = currentTexts.title; // Update browser tab title
        backButton.textContent = currentTexts.backButton;
        labelCategory.textContent = currentTexts.labelCategory;
        labelValue.textContent = currentTexts.labelValue;
        labelFrom.textContent = currentTexts.labelFrom;
        labelTo.textContent = currentTexts.labelTo;
        valueInput.placeholder = currentTexts.placeholderValue;
        convertButton.textContent = currentTexts.convertButtonText;
        if (themeLabel) {
            themeLabel.textContent = currentTexts.themeLabel;
        }

        // Update language button states
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');
        btnFr.setAttribute('aria-pressed', lang === 'fr');
        btnEn.setAttribute('aria-pressed', lang === 'en');

        // Update units (dropdowns) - This implicitly clears results/errors
        updateUnits(); // Call this to reset state and dropdowns
    }


    // Populate unit dropdowns based on category
    function updateUnits() {
        const category = categorySelect.value;

        // Clear previous options and results/errors
        fromUnitSelect.innerHTML = "";
        toUnitSelect.innerHTML = "";
        clearResultAndError(); // Ensures result prefix is updated too

        let unitList;
        if (category === "temperature") {
            unitList = conversions.temperature.units;
        } else if (conversions[category] && conversions[category].units) {
            unitList = Object.keys(conversions[category].units);
        } else {
            console.error("Invalid category selected or category data missing:", category);
            displayError("errorConfig"); // Use error key
            return;
        }

        // Populate dropdowns (Using unit keys directly as text - assumes no translation needed for unit names)
        unitList.forEach(unit => {
            const optionFrom = document.createElement("option");
            optionFrom.value = unit;
            optionFrom.textContent = unit;
            fromUnitSelect.appendChild(optionFrom);

            const optionTo = document.createElement("option");
            optionTo.value = unit;
            optionTo.textContent = unit;
            toUnitSelect.appendChild(optionTo);
        });

        // Select different default units for better UX
        if (fromUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = Math.min(1, fromUnitSelect.options.length - 1); // Ensure index is valid
        }
    }


    // Perform the actual unit conversion
    function performConversion() {
        const currentLang = getCurrentLang();
        const currentTexts = texts[currentLang];
        clearResultAndError(); // Clear previous state first, set correct prefix

        const category = categorySelect.value;
        const valueStr = valueInput.value.trim();
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        let result;

        // Validate input value
        if (valueStr === "") {
             // Don't show error if empty, just keep the default result prefix
             return;
        }

        const value = parseFloat(valueStr);
        if (isNaN(value)) {
            displayError("errorValue"); // Use error key
            return;
        }

         // Check if units are selected
         if (!fromUnit || !toUnit) {
             displayError("errorUnits"); // Use error key
             return;
         }

        try {
            if (category === "temperature") {
                result = conversions.temperature.convert(value, fromUnit, toUnit);
            } else if (conversions[category] && conversions[category].units && conversions[category].base) {
                // Linear conversions
                const categoryData = conversions[category];
                const fromFactor = categoryData.units[fromUnit];
                const toFactor = categoryData.units[toUnit];

                if (typeof fromFactor === 'undefined' || typeof toFactor === 'undefined') {
                   throw new Error("errorFactors"); // Throw error key
                }
                const baseValue = fromFactor === 0 ? 0 : value / fromFactor; // Avoid division by zero
                result = baseValue * toFactor;
            } else {
                throw new Error("errorLogic"); // Throw error key
            }

            // Check for valid result after conversion
            if (isNaN(result)) {
                 throw new Error("errorResult"); // Throw error key
            }

            // Format and display result
            const precision = (Math.abs(result) > 0.0001 || result === 0) ? 6 : 10;
            const formattedResult = Number(result.toFixed(precision));

            // Use translated prefix
            resultDisplay.textContent = `${currentTexts.resultPrefix} ${value} ${fromUnit} = ${formattedResult} ${toUnit}`;

        } catch (error) {
            console.error("Conversion Error:", error);
            // Display error using the key from the caught error or a default key
            const errorKey = error instanceof Error ? error.message : "errorUnknown";
            displayError(errorKey);
        }
    } // --- End of performConversion ---

    // --- Event Listeners ---
    categorySelect.addEventListener("change", updateUnits); // Update units when category changes
    convertButton.addEventListener("click", performConversion); // Convert on button click
    btnFr.addEventListener('click', () => updateTexts('fr')); // Language buttons
    btnEn.addEventListener('click', () => updateTexts('en'));

    // Optional: Convert on Enter key press in the value input field
    valueInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            performConversion();
        }
    });

    // --- Initial Setup ---
    // Get initial language (Stored > Browser > Default 'en')
    const initialLang = localStorage.getItem('unitConverterLang') || navigator.language.split('-')[0] || 'en';
    updateTexts(initialLang); // Initial UI setup based on language

    // Optional: Save language preference on change
    btnFr.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'en')); // Should be 'fr'
    btnEn.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'en'));


}); // --- End of DOMContentLoaded ---
// --- END OF FILE unitconverter_script.js ---