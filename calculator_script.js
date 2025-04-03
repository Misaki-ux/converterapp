// calculator_script.js (Refonte pour Solve-For-Any)

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const inputs = {
        A: document.getElementById('inputA'),
        B: document.getElementById('inputB'),
        C: document.getElementById('inputC'),
        D: document.getElementById('inputD')
    };
    const inputItems = { // Conteneurs pour styling '.calculated'
        A: inputs.A.closest('.input-item'),
        B: inputs.B.closest('.input-item'),
        C: inputs.C.closest('.input-item'),
        D: inputs.D.closest('.input-item')
    };
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButtonCalculator');
    const errorMessageDiv = document.getElementById('error-message-calculator');
    // const resultOutput = document.getElementById('resultOutput'); // Optionnel si gardé
    // const copyButton = document.getElementById('copyButtonCalculator'); // Optionnel si gardé

    // Language Elements
    const pageTitle = document.getElementById('page-title');
    const backButton = document.getElementById('back-to-home');
    const introText = document.getElementById('intro-text');
    // const resultLabel = document.getElementById('result-label'); // Optionnel si gardé
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');
    const htmlTag = document.documentElement;

    // --- Texts ---
    const texts = {
        fr: {
            title: "Calculateur (A × B) / C = D",
            intro: "Remplissez exactement trois des quatre champs. Le champ laissé vide sera calculé automatiquement lorsque vous cliquerez sur \"Calculer\".",
            placeholderA: "Valeur A",
            placeholderB: "Valeur B",
            placeholderC: "Valeur C",
            placeholderD: "Valeur D",
            // resultLabel: "Résultat Calculé :", // Si boîte résultat gardée
            backButton: "← Retour à l'accueil",
            calculateButton: "Calculer",
            resetButton: "Effacer",
            // copyButton: "Copier",
            // copiedButton: "Copié !",
            errorResult: "Erreur",
            errorDivZero: "Erreur : Division par zéro lors du calcul.",
            errorInvalidInput: "Veuillez entrer des nombres valides dans les champs remplis.",
            errorInputCount: "Veuillez remplir exactement trois champs.",
            errorCannotCalculate: "Impossible de calculer avec les valeurs fournies."
        },
        en: {
            title: "Calculator (A × B) / C = D",
            intro: "Fill in exactly three of the four fields. The empty field will be calculated automatically when you click \"Calculate\".",
            placeholderA: "Value A",
            placeholderB: "Value B",
            placeholderC: "Value C",
            placeholderD: "Value D",
            // resultLabel: "Calculated Result:", // If result box kept
            backButton: "← Back to Home",
            calculateButton: "Calculate",
            resetButton: "Reset",
            // copyButton: "Copy",
            // copiedButton: "Copied!",
            errorResult: "Error",
            errorDivZero: "Error: Division by zero during calculation.",
            errorInvalidInput: "Please enter valid numbers in the filled fields.",
            errorInputCount: "Please fill in exactly three fields.",
            errorCannotCalculate: "Cannot calculate with the provided values."
        }
    };

    // --- Functions ---
    function updateTexts(lang) {
        htmlTag.lang = lang;
        const currentTexts = texts[lang];

        pageTitle.textContent = currentTexts.title;
        backButton.textContent = currentTexts.backButton;
        introText.textContent = currentTexts.intro;
        inputs.A.placeholder = currentTexts.placeholderA;
        inputs.B.placeholder = currentTexts.placeholderB;
        inputs.C.placeholder = currentTexts.placeholderC;
        inputs.D.placeholder = currentTexts.placeholderD;
        // if (resultLabel) resultLabel.textContent = currentTexts.resultLabel;

        calculateButton.textContent = currentTexts.calculateButton;
        resetButton.textContent = currentTexts.resetButton;
        // if (copyButton) copyButton.textContent = currentTexts.copyButton;

        // ARIA for lang buttons
        btnFr.setAttribute('aria-pressed', lang === 'fr');
        btnEn.setAttribute('aria-pressed', lang === 'en');
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');

        // Clear previous results/errors on lang change
        resetCalculationState();
    }

    function resetCalculationState() {
        errorMessageDiv.style.display = 'none';
        // if (resultOutput) resultOutput.textContent = '--';
        // if (copyButton) copyButton.disabled = true;
        // Clear calculated style and values from inputs
        Object.values(inputs).forEach(input => {
            // input.value = ''; // Ne pas effacer à chaque recalcul, seulement au reset
            input.closest('.input-item').classList.remove('calculated');
        });
    }

    function performCalculation() {
        resetCalculationState(); // Clear previous state first
        const currentLang = htmlTag.lang || 'fr';
        let emptyFieldKey = null;
        let filledValues = {};
        let emptyCount = 0;
        let hasInvalidInput = false;

        // 1. Find empty field, get filled values, validate numbers
        for (const key in inputs) {
            const inputElement = inputs[key];
            const valueStr = inputElement.value.trim();
            if (valueStr === '') {
                emptyCount++;
                emptyFieldKey = key;
            } else {
                const valueNum = parseFloat(valueStr);
                if (isNaN(valueNum)) {
                    hasInvalidInput = true;
                }
                filledValues[key] = valueNum; // Store parsed number or NaN
            }
        }

        // 2. Validate input count and values
        if (emptyCount !== 1) {
            showError(texts[currentLang].errorInputCount);
            return;
        }
        if (hasInvalidInput) {
            showError(texts[currentLang].errorInvalidInput);
            return;
        }

        // 3. Perform calculation based on the empty field
        let result = null;
        const { A, B, C, D } = filledValues; // Destructure values (some will be undefined)

        try {
            if (emptyFieldKey === 'D') { // Solve for D = (A * B) / C
                if (C === 0) throw new Error(texts[currentLang].errorDivZero);
                result = (A * B) / C;
            } else if (emptyFieldKey === 'C') { // Solve for C = (A * B) / D
                if (D === 0) throw new Error(texts[currentLang].errorDivZero);
                result = (A * B) / D;
            } else if (emptyFieldKey === 'B') { // Solve for B = (C * D) / A
                if (A === 0) throw new Error(texts[currentLang].errorDivZero);
                result = (C * D) / A;
            } else if (emptyFieldKey === 'A') { // Solve for A = (C * D) / B
                if (B === 0) throw new Error(texts[currentLang].errorDivZero);
                result = (C * D) / B;
            }

            // 4. Validate result and display
            if (result === null || !isFinite(result)) {
                 throw new Error(texts[currentLang].errorCannotCalculate);
            }

            const formattedResult = Number.isInteger(result) ? result : result.toFixed(4); // Or adjust precision
            inputs[emptyFieldKey].value = formattedResult;
            inputItems[emptyFieldKey].classList.add('calculated'); // Highlight calculated field

            // Update optional result box if kept
            // if(resultOutput) resultOutput.textContent = formattedResult;
            // if(copyButton) copyButton.disabled = false;

        } catch (error) {
            showError(error.message);
        }
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
        // if (resultOutput) resultOutput.textContent = texts[htmlTag.lang || 'fr'].errorResult;
        // if (copyButton) copyButton.disabled = true;
    }


    // --- Event Listeners ---
    calculateButton.addEventListener('click', performCalculation);

    resetButton.addEventListener('click', () => {
        Object.values(inputs).forEach(input => { input.value = ''; });
        resetCalculationState();
    });

    // Optional: Recalculate on Enter key press in any input field
    Object.values(inputs).forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if inside a form
                performCalculation();
            }
        });
    });

    btnFr.addEventListener('click', () => updateTexts('fr'));
    btnEn.addEventListener('click', () => updateTexts('en'));

    // --- Initial Setup ---
    updateTexts('fr');
    resetCalculationState(); // Ensure clean state on load

});