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

    // --- Language Data --- (VOS TRADUCTIONS ICI)
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
            errorUnknown: "Erreur de calcul inconnue."
        },
        en: {
            title: "Unit Converter",
            backButton: "← Back to Tools",
            labelCategory: "Category:",
            labelValue: "Value:",
            labelFrom: "From:",
            labelTo: "To:", // Correction : était "Vers :"
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
            errorUnknown: "Could not perform conversion."
        }
    };

    // --- Conversion Data ---
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
    function getCurrentLang() { return htmlTag.lang || 'en'; }
    function clearResultAndError() {
        const currentLang = getCurrentLang(); const currentTexts = texts[currentLang];
        resultDisplay.textContent = currentTexts.resultPrefix + " ";
        errorDisplay.textContent = ""; errorDisplay.style.display = "none";
    }
    function displayError(errorKey) {
        const currentLang = getCurrentLang(); const currentTexts = texts[currentLang];
        const message = currentTexts[errorKey] || currentTexts.errorUnknown;
        errorDisplay.textContent = message; errorDisplay.style.display = "block";
        resultDisplay.textContent = currentTexts.resultPrefix + " ";
    }

    // --- Core Functions ---
    function updateTexts(lang) {
        lang = texts[lang] ? lang : 'en'; htmlTag.lang = lang;
        const currentTexts = texts[lang];

        // Update static text elements
        // Vérifie bien que tous ces éléments existent et ont les bons IDs dans ton HTML
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

        // Update language button states
        if (btnFr) { btnFr.classList.toggle('active', lang === 'fr'); btnFr.setAttribute('aria-pressed', lang === 'fr'); }
        if (btnEn) { btnEn.classList.toggle('active', lang === 'en'); btnEn.setAttribute('aria-pressed', lang === 'en'); }

        // Update units dropdowns (which also clears results/errors with correct prefix)
        updateUnits();
    }

    function updateUnits() {
        const category = categorySelect.value;
        fromUnitSelect.innerHTML = ""; toUnitSelect.innerHTML = "";
        clearResultAndError(); // Important: Clears results/errors using current language prefix

        let unitList;
        if (category === "temperature") { unitList = conversions.temperature.units; }
        else if (conversions[category] && conversions[category].units) { unitList = Object.keys(conversions[category].units); }
        else { console.error("Invalid category:", category); displayError("errorConfig"); return; }

        unitList.forEach(unit => { // Populate dropdowns
            const optionFrom = document.createElement("option"); optionFrom.value = unit; optionFrom.textContent = unit; fromUnitSelect.appendChild(optionFrom);
            const optionTo = document.createElement("option"); optionTo.value = unit; optionTo.textContent = unit; toUnitSelect.appendChild(optionTo);
        });
        if (fromUnitSelect.options.length > 1) { toUnitSelect.selectedIndex = Math.min(1, fromUnitSelect.options.length - 1); }
    }

    function performConversion() {
        const currentLang = getCurrentLang(); const currentTexts = texts[currentLang];
        clearResultAndError(); // Start fresh with correct prefix

        const category = categorySelect.value; const valueStr = valueInput.value.trim();
        const fromUnit = fromUnitSelect.value; const toUnit = toUnitSelect.value;
        let result;

        if (valueStr === "") return; // Exit if no value
        const value = parseFloat(valueStr);
        if (isNaN(value)) { displayError("errorValue"); return; }
        if (!fromUnit || !toUnit) { displayError("errorUnits"); return; } // Should not happen if updateUnits works

        try { // Perform conversion based on category
            if (category === "temperature") { result = conversions.temperature.convert(value, fromUnit, toUnit); }
            else if (conversions[category]?.units && conversions[category]?.base) { // Optional chaining for safety
                const categoryData = conversions[category];
                const fromFactor = categoryData.units[fromUnit]; const toFactor = categoryData.units[toUnit];
                if (typeof fromFactor === 'undefined' || typeof toFactor === 'undefined') throw new Error("errorFactors");
                const baseValue = fromFactor === 0 ? 0 : value / fromFactor; result = baseValue * toFactor;
            } else { throw new Error("errorLogic"); }
            if (isNaN(result)) throw new Error("errorResult"); // Check result validity

            // Format and display
            const precision = (Math.abs(result) > 0.0001 || result === 0) ? 6 : 10;
            const formattedResult = Number(result.toFixed(precision));
            resultDisplay.textContent = `${currentTexts.resultPrefix} ${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
        } catch (error) {
            console.error("Conversion Error:", error);
            const errorKey = error instanceof Error ? error.message : "errorUnknown";
            displayError(errorKey.includes("error") ? errorKey : "errorUnknown"); // Ensure we pass a valid key
        }
    }

    // --- Event Listeners ---
    categorySelect.addEventListener("change", updateUnits);
    convertButton.addEventListener("click", performConversion);
    btnFr.addEventListener('click', () => updateTexts('fr'));
    btnEn.addEventListener('click', () => updateTexts('en'));
    valueInput.addEventListener("keypress", (event) => { if (event.key === "Enter") { event.preventDefault(); performConversion(); } });

    // --- Initial Setup ---
    const initialLang = localStorage.getItem('unitConverterLang') || navigator.language.split('-')[0] || 'en';
    updateTexts(initialLang);

    // Save language preference - *** CORRECTION ICI ***
    btnFr.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'fr')); // Doit être 'fr'
    btnEn.addEventListener('click', () => localStorage.setItem('unitConverterLang', 'en'));

});
// --- END OF FILE unitconverter_script.js ---