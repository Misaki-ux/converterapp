// --- START OF FILE calculator_script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const htmlTag = document.documentElement;
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const inputC = document.getElementById('inputC');
    const inputD = document.getElementById('inputD');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorDiv = document.getElementById('errorDiv');
    const inputs = [inputA, inputB, inputC, inputD]; // Array for easy iteration

    // Language / Text Elements
    const pageTitle = document.getElementById('page-title');
    const backButton = document.getElementById('back-to-home');
    const introText = document.getElementById('intro-text');
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');
    const themeLabel = document.getElementById('theme-label');

    // --- Language Data --- (COMPLÉTEZ SI NÉCESSAIRE)
    const texts = {
        fr: {
            title: "Calculateur Produit en Croix",
            backButton: "← Retour aux Outils",
            introText: "Entrez trois valeurs pour calculer la quatrième (A / B = C / D).",
            calculateButton: "Calculer",
            resetButton: "Effacer",
            themeLabel: "Mode Sombre",
            errorThreeFields: "Veuillez remplir exactement trois champs pour un calcul initial.",
            errorFourFieldsInfo: "Quatre champs remplis. Recalcul de D effectué.", // Message informatif si 4 champs
            errorInvalidNumber: "Veuillez entrer des nombres valides dans les champs remplis.",
            errorDivisionByZero: "Division par zéro impossible.",
            errorGeneral: "Erreur de calcul."
        },
        en: {
            title: "Cross-Multiplication Calculator",
            backButton: "← Back to Tools",
            introText: "Enter three values to calculate the fourth (A / B = C / D).",
            calculateButton: "Calculate",
            resetButton: "Reset",
            themeLabel: "Dark Mode",
            errorThreeFields: "Please fill exactly three fields for an initial calculation.",
            errorFourFieldsInfo: "Four fields filled. Recalculated D.", // Info message if 4 fields
            errorInvalidNumber: "Please enter valid numbers in the filled fields.",
            errorDivisionByZero: "Division by zero is not possible.",
            errorGeneral: "Calculation error."
        }
    };

    // --- Helper Functions ---
    function getCurrentLang() { return htmlTag.lang || 'fr'; } // Default fr

    function displayError(key, isInfo = false) {
        const lang = getCurrentLang();
        const message = texts[lang][key] || texts[lang].errorGeneral;
        errorDiv.textContent = message;
        // Change style based on whether it's an error or just info
        errorDiv.style.backgroundColor = isInfo ? 'var(--result-bg, #e9f5ff)' : 'var(--error-bg, #f8d7da)';
        errorDiv.style.color = isInfo ? 'var(--result-value-color, #0056b3)' : 'var(--error-text, #721c24)';
        errorDiv.style.borderColor = isInfo ? 'var(--result-border, #bde0ff)' : 'var(--error-border, #f5c6cb)';
        errorDiv.style.display = 'block';
    }

    function clearError() {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

     function clearInputs() {
        inputs.forEach(input => {
            if(input) input.value = '';
            // Remove styling indicating calculated field if any
             if(input) input.closest('.input-item')?.classList.remove('calculated');
        });
        clearError();
    }

    // Format number or return empty string
    function formatResult(num) {
         if (isNaN(num) || !isFinite(num)) {
             return ''; // Return empty if result is invalid
         }
         // Simple formatting, adjust decimals as needed
         return parseFloat(num.toFixed(6)); // Use Number() to remove trailing zeros if needed: Number(num.toFixed(6))
    }


    // --- Core Functions ---
    function updateTexts(lang) {
        lang = texts[lang] ? lang : 'fr'; htmlTag.lang = lang;
        const currentTexts = texts[lang];

        if (pageTitle) pageTitle.textContent = currentTexts.title;
        document.title = currentTexts.title;
        if (backButton) backButton.textContent = currentTexts.backButton;
        if (introText) introText.textContent = currentTexts.introText;
        if (calculateBtn) calculateBtn.textContent = currentTexts.calculateButton;
        if (resetBtn) resetBtn.textContent = currentTexts.resetButton;
        if (themeLabel) themeLabel.textContent = currentTexts.themeLabel;
        // Placeholder text could also be added here if needed

        if (btnFr) { btnFr.classList.toggle('active', lang === 'fr'); btnFr.setAttribute('aria-pressed', lang === 'fr'); }
        if (btnEn) { btnEn.classList.toggle('active', lang === 'en'); btnEn.setAttribute('aria-pressed', lang === 'en'); }

        // Recalculate or clear error to show translated message if error was present
        if (errorDiv.style.display === 'block') {
             // We don't know which error was shown, so maybe just clear it on lang change?
             // Or try to recalculate? Clearing is safer.
             clearError();
        }
    }

    function calculate() {
        clearError();
        // Remove previous 'calculated' styling
        inputs.forEach(input => input?.closest('.input-item')?.classList.remove('calculated'));


        const values = {
            A: inputA ? parseFloat(inputA.value) : NaN,
            B: inputB ? parseFloat(inputB.value) : NaN,
            C: inputC ? parseFloat(inputC.value) : NaN,
            D: inputD ? parseFloat(inputD.value) : NaN
        };

        const filledValues = Object.entries(values).filter(([key, val]) => !isNaN(val));
        const emptyKeys = Object.entries(values).filter(([key, val]) => isNaN(val)).map(([key]) => key);

        const filledCount = filledValues.length;

        let targetKey = null;
        let result = NaN;

        // --- CASE 1: Exactly 3 fields filled ---
        if (filledCount === 3 && emptyKeys.length === 1) {
            targetKey = emptyKeys[0];
            const [val1, val2, val3] = filledValues.map(entry => entry[1]); // Get the 3 valid numbers
            const keys = filledValues.map(entry => entry[0]); // Get the keys of the valid numbers

            try {
                switch (targetKey) {
                    case 'A': // Need B, C, D
                        if (values.D === 0) throw new Error("errorDivisionByZero");
                        result = (values.B * values.C) / values.D;
                        break;
                    case 'B': // Need A, C, D
                        if (values.C === 0) throw new Error("errorDivisionByZero");
                        result = (values.A * values.D) / values.C;
                        break;
                    case 'C': // Need A, B, D
                        if (values.B === 0) throw new Error("errorDivisionByZero");
                        result = (values.A * values.D) / values.B;
                        break;
                    case 'D': // Need A, B, C
                        if (values.A === 0) throw new Error("errorDivisionByZero");
                        result = (values.B * values.C) / values.A;
                        break;
                }
            } catch (e) {
                displayError(e.message);
                return;
            }

        // --- CASE 2: Exactly 4 fields filled (Recalculate D by default) ---
        } else if (filledCount === 4) {
            targetKey = 'D'; // Assume we recalculate D
            // Verify other numbers are valid (already done by filledCount check)
             if (values.A === 0) {
                 displayError("errorDivisionByZero");
                 return;
             }
            result = (values.B * values.C) / values.A;
            displayError("errorFourFieldsInfo", true); // Show info message

        // --- CASE 3: Invalid number of fields or other issues ---
        } else {
             // Check if any field has non-numeric input when it's not empty
             const invalidInput = inputs.some(input => input && input.value.trim() !== '' && isNaN(parseFloat(input.value)));
             if (invalidInput) {
                 displayError("errorInvalidNumber");
             } else if (filledCount < 3) {
                displayError("errorThreeFields"); // Changed error message
             } else {
                 // This case might occur if somehow > 4 fields or unexpected NaN state
                 displayError("errorGeneral");
             }
            return; // Stop calculation
        }

        // --- Display result ---
        if (targetKey && !isNaN(result) && isFinite(result)) {
            const targetInput = document.getElementById(`input${targetKey}`);
            if (targetInput) {
                targetInput.value = formatResult(result);
                // Add styling to indicate this field was calculated
                 targetInput.closest('.input-item')?.classList.add('calculated');
            }
        } else if (isNaN(result) || !isFinite(result)) {
             // Handle cases where calculation resulted in NaN or Infinity, beyond division by zero
             displayError("errorGeneral"); // Or a more specific error if possible
        }

         // Highlight the calculated field (optional styling)
         const targetElement = document.getElementById(`input${targetKey}`);
         if (targetElement) {
             targetElement.closest('.input-item')?.classList.add('calculated');
             // Optional: Briefly flash background or border
             targetElement.style.transition = 'none'; // Disable transition for immediate effect
             targetElement.style.backgroundColor = 'var(--accent-color-darker, yellow)'; // Temporary highlight
             setTimeout(() => {
                 targetElement.style.transition = 'background-color 0.5s ease'; // Re-enable transition
                 targetElement.style.backgroundColor = ''; // Reset background
                 targetElement.closest('.input-item')?.classList.add('calculated'); // Ensure class stays
             }, 300);
         }

    }


    // --- Event Listeners ---
    if (calculateBtn) calculateBtn.addEventListener('click', calculate);
    if (resetBtn) resetBtn.addEventListener('click', clearInputs);
    if (btnFr) btnFr.addEventListener('click', () => updateTexts('fr'));
    if (btnEn) btnEn.addEventListener('click', () => updateTexts('en'));

    // Optional: Recalculate on Enter key press in any input field
    inputs.forEach(input => {
        if (input) {
            input.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevent form submission if applicable
                    calculate();
                }
            });
        }
    });


    // --- Initial Setup ---
    const initialLang = localStorage.getItem('calculatorLang') || navigator.language.split('-')[0] || 'fr';
    updateTexts(initialLang);

    // Save language preference
    if (btnFr) btnFr.addEventListener('click', () => localStorage.setItem('calculatorLang', 'fr'));
    if (btnEn) btnEn.addEventListener('click', () => localStorage.setItem('calculatorLang', 'en'));


}); // --- End of DOMContentLoaded ---
// --- END OF FILE calculator_script.js ---