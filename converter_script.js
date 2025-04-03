// --- START OF FILE converter_script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const htmlTag = document.documentElement;
    const cmInputL = document.getElementById('cmInputL');
    const cmInputH = document.getElementById('cmInputH');
    const cmInputDiag = document.getElementById('cmInputDiag');
    const outputL = document.getElementById('outputL');
    const outputH = document.getElementById('outputH');
    const outputDiagCmCalc = document.getElementById('outputDiagCmCalc');
    const outputDiagInCalc = document.getElementById('outputDiagInCalc');
    const outputFinalInches = document.getElementById('outputFinalInches');
    const outputAspectRatio = document.getElementById('outputAspectRatio');
    const outputAreaCm2 = document.getElementById('outputAreaCm2');
    const outputAreaIn2 = document.getElementById('outputAreaIn2');
    const errorMessageDiv = document.getElementById('error-message-converter');
    const resetButton = document.getElementById('resetButtonConverter');
    const copyButtons = document.querySelectorAll('.copy-button');

    // Language Elements
    const pageTitle = document.getElementById('page-title');
    const backButton = document.getElementById('back-to-home');
    const labelL = document.getElementById('label-l');
    const labelH = document.getElementById('label-h');
    const labelDiagMeasured = document.getElementById('label-diag-measured');
    const optionalNote = document.getElementById('optional-note');
    const labelFinalSize = document.getElementById('label-final-size');
    const detailsTitle = document.getElementById('details-title');
    const labelResL = document.getElementById('label-res-l');
    const labelResH = document.getElementById('label-res-h');
    const labelResDiagCmCalc = document.getElementById('label-res-diag-cm-calc');
    const labelResDiagInCalc = document.getElementById('label-res-diag-in-calc');
    const labelResAspectRatio = document.getElementById('label-res-aspect-ratio');
    const labelResAreaCm = document.getElementById('label-res-area-cm');
    const labelResAreaIn = document.getElementById('label-res-area-in');
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');
    const themeLabel = document.getElementById('theme-label'); // Make sure this ID exists in your HTML (for the theme toggle)

    // --- Constants & Helpers ---
    const CM_TO_INCH = 2.54;
    // Returns formatted number or '--' if input is invalid/NaN
    const formatNumber = (num, decimals = 2) => {
        const parsedNum = parseFloat(num);
        return (!isNaN(parsedNum)) ? parsedNum.toFixed(decimals) : '--';
    };
    // Specific formatter for aspect ratio parts, returns '?' on invalid input
    const formatNumberRatio = (num, decimals = 1) => {
        const parsedNum = parseFloat(num);
        return (!isNaN(parsedNum) && isFinite(parsedNum) && parsedNum !== 0) ? parsedNum.toFixed(decimals) : '?';
    };

    // Greatest Common Divisor function (handles NaN and returns 1 if gcd is 0)
    function gcd(a, b) {
        a = Math.abs(Math.round(a * 100)); // Work with integers (scaled)
        b = Math.abs(Math.round(b * 100));
        if (isNaN(a) || isNaN(b)) return 1; // Safety check for NaN inputs
        if (b === 0) {
             return a === 0 ? 1 : a / 100; // Return 1 if both a&b were 0, else scaled a
        }
        while (b) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        const result = a / 100; // Scale back down
        return result === 0 ? 1 : result; // Return 1 if gcd is 0 to avoid division by zero later
    }

    // --- Language Data --- (FILL WITH YOUR ACTUAL FULL TRANSLATIONS)
    const texts = {
        fr: {
            title: "Convertisseur Taille Écran",
            backButton: "← Retour à l'accueil",
            labelL: "Largeur (L) en centimètres (cm):",
            placeholderL: "Entrez la largeur en cm",
            labelH: "Hauteur (H) en centimètres (cm):",
            placeholderH: "Entrez la hauteur en cm",
            labelDiagMeasured: "Diagonale Mesurée (Optionnel) en cm:",
            placeholderDiag: "Si connue, pour + de précision",
            optionalNote: "Utilisé pour le calcul final en pouces si fourni.",
            labelFinalSize: "Taille d'écran estimée :",
            detailsTitle: "Détails du Calcul :",
            labelResL: "Largeur Convertie:",
            labelResH: "Hauteur Convertie:",
            labelResDiagCmCalc: "Diagonale (Calculée L/H):",
            labelResDiagInCalc: "Diagonale (Calculée L/H):",
            labelResAspectRatio: "Ratio d'Aspect (L:H):",
            labelResAreaCm: "Surface:",
            labelResAreaIn: "Surface:",
            unitCm: "cm",
            unitIn: "pouces",
            unitCm2: "cm²",
            unitIn2: "pouces²",
            resetButton: "Effacer",
            copyButton: "Copier",
            copiedButton: "Copié !",
            themeLabel: "Mode Sombre",
            errorMsgLh: "Veuillez entrer des valeurs numériques positives valides pour la Largeur et la Hauteur.",
            errorMsgDiag: "La Diagonale Mesurée doit être une valeur numérique positive valide si fournie.",
            copyAriaBase: "Copier ",
            copyAriaFinalSize: "la taille d'écran estimée",
            copyAriaL: "la largeur convertie",
            copyAriaH: "la hauteur convertie",
            copyAriaDiagInCalc: "la diagonale calculée en pouces",
            copySuccess: "Copié avec succès !", // More descriptive success message
            copyError: "La copie a échoué"      // More descriptive error message
        },
        en: {
            title: "Screen Size Converter",
            backButton: "← Back to Home",
            labelL: "Width (W) in centimeters (cm):",
            placeholderL: "Enter width in cm",
            labelH: "Height (H) in centimeters (cm):",
            placeholderH: "Enter height in cm",
            labelDiagMeasured: "Measured Diagonal (Optional) in cm:",
            placeholderDiag: "If known, for more accuracy",
            optionalNote: "Used for the final inches calculation if provided.",
            labelFinalSize: "Estimated Screen Size:",
            detailsTitle: "Calculation Details:",
            labelResL: "Converted Width:",
            labelResH: "Converted Height:",
            labelResDiagCmCalc: "Diagonal (Calculated W/H):",
            labelResDiagInCalc: "Diagonal (Calculated W/H):",
            labelResAspectRatio: "Aspect Ratio (W:H):",
            labelResAreaCm: "Area:",
            labelResAreaIn: "Area:",
            unitCm: "cm",
            unitIn: "inches",
            unitCm2: "cm²",
            unitIn2: "inches²",
            resetButton: "Reset",
            copyButton: "Copy",
            copiedButton: "Copied!",
            themeLabel: "Dark Mode",
            errorMsgLh: "Please enter valid positive numeric values for Width and Height.",
            errorMsgDiag: "The Measured Diagonal must be a valid positive numeric value if provided.",
            copyAriaBase: "Copy ",
            copyAriaFinalSize: "the estimated screen size",
            copyAriaL: "the converted width",
            copyAriaH: "the converted height",
            copyAriaDiagInCalc: "the calculated diagonal in inches",
            copySuccess: "Copied successfully!",
            copyError: "Copy failed"
        }
    };

    // --- Update UI Text ---
    function updateTexts(lang) {
        // Ensure lang is valid, default to 'fr' otherwise
        lang = texts[lang] ? lang : 'fr';
        htmlTag.lang = lang; // Set document language
        const currentTexts = texts[lang];

        // Set text content for various elements
        pageTitle.textContent = currentTexts.title;
        document.title = currentTexts.title; // Update browser tab title too
        backButton.textContent = currentTexts.backButton;
        labelL.textContent = currentTexts.labelL;
        cmInputL.placeholder = currentTexts.placeholderL;
        labelH.textContent = currentTexts.labelH;
        cmInputH.placeholder = currentTexts.placeholderH;
        labelDiagMeasured.textContent = currentTexts.labelDiagMeasured;
        cmInputDiag.placeholder = currentTexts.placeholderDiag;
        optionalNote.textContent = currentTexts.optionalNote;
        labelFinalSize.textContent = currentTexts.labelFinalSize;
        detailsTitle.textContent = currentTexts.detailsTitle;
        labelResL.textContent = currentTexts.labelResL;
        labelResH.textContent = currentTexts.labelResH;
        labelResDiagCmCalc.textContent = currentTexts.labelResDiagCmCalc;
        labelResDiagInCalc.textContent = currentTexts.labelResDiagInCalc;
        labelResAspectRatio.textContent = currentTexts.labelResAspectRatio;
        labelResAreaCm.textContent = currentTexts.labelResAreaCm;
        labelResAreaIn.textContent = currentTexts.labelResAreaIn;
        resetButton.textContent = currentTexts.resetButton;
        if (themeLabel) { // Check if themeLabel exists before setting text
           themeLabel.textContent = currentTexts.themeLabel;
        }

        // Update language button states
        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');
        btnFr.setAttribute('aria-pressed', lang === 'fr');
        btnEn.setAttribute('aria-pressed', lang === 'en');

        // Update units using data-unit-type (More robust)
        document.querySelectorAll('.unit[data-unit-type]').forEach(span => {
            const unitType = span.dataset.unitType;
            switch (unitType) {
                case 'length-cm': span.textContent = currentTexts.unitCm; break;
                case 'length-in': span.textContent = currentTexts.unitIn; break;
                case 'area-cm': span.textContent = currentTexts.unitCm2; break;
                case 'area-in': span.textContent = currentTexts.unitIn2; break;
            }
        });

        // Update copy buttons text and aria-labels (resetting 'copied' state)
        copyButtons.forEach(btn => {
            btn.textContent = currentTexts.copyButton;
            btn.classList.remove('copied', 'copy-error'); // Ensure visual states are removed

            const targetId = btn.dataset.clipboardTarget?.substring(1); // Use optional chaining
            if (!targetId) return; // Skip if data attribute is missing

            let ariaDesc = '';
            switch (targetId) {
                case 'outputFinalInches': ariaDesc = currentTexts.copyAriaFinalSize; break;
                case 'outputL': ariaDesc = currentTexts.copyAriaL; break;
                case 'outputH': ariaDesc = currentTexts.copyAriaH; break;
                case 'outputDiagInCalc': ariaDesc = currentTexts.copyAriaDiagInCalc; break;
                 // Add cases for other potential copy targets if needed
            }
            // Set aria-label only if a description was found
            if (ariaDesc) {
               btn.setAttribute('aria-label', currentTexts.copyAriaBase + ariaDesc);
            } else {
               // Fallback or remove aria-label if description isn't set
               btn.removeAttribute('aria-label');
            }
        });

        // Recalculate to update values and potentially show translated errors
        calculateConversion();
    }

    // --- Perform Conversion Calculation ---
    function calculateConversion() {
        const l_cm_input = cmInputL.value.trim(); // Trim whitespace
        const h_cm_input = cmInputH.value.trim();
        const diag_cm_measured_input = cmInputDiag.value.trim();

        const l_cm = parseFloat(l_cm_input);
        const h_cm = parseFloat(h_cm_input);
        const diag_cm_measured = parseFloat(diag_cm_measured_input);

        const currentLang = htmlTag.lang || 'fr'; // Default language
        const currentTexts = texts[currentLang]; // Get current language texts
        let errorMessages = []; // *** Variable is DEFINED here, within the function scope ***
        let hasBlockingError = false; // Flag for errors preventing calculations

        // --- Reset Outputs & States ---
        outputL.textContent = '--';
        outputH.textContent = '--';
        outputDiagCmCalc.textContent = '--';
        outputDiagInCalc.textContent = '--';
        outputFinalInches.textContent = '--';
        outputAspectRatio.textContent = '--';
        outputAreaCm2.textContent = '--';
        outputAreaIn2.textContent = '--';
        errorMessageDiv.textContent = ''; // Clear previous errors
        errorMessageDiv.style.display = 'none'; // Hide error div

        // Reset all copy buttons to initial state (disabled, standard text)
        copyButtons.forEach(btn => {
            btn.disabled = true; // Disable initially, enable later if value is valid
            btn.textContent = currentTexts.copyButton;
            btn.classList.remove('copied', 'copy-error'); // Remove visual feedback classes
        });

        // --- Validate L and H ---
        // Don't calculate or show errors if required fields are empty
        if (l_cm_input === '' || h_cm_input === '') {
           // Do nothing, keep outputs as '--'
           return;
        }
        if (isNaN(l_cm) || isNaN(h_cm) || l_cm <= 0 || h_cm <= 0) {
            errorMessages.push(currentTexts.errorMsgLh);
            hasBlockingError = true; // Cannot proceed with calculations
        }

        // --- Calculations (only if L/H are valid) ---
        let final_diag_in = NaN; // Use NaN to track validity

        if (!hasBlockingError) {
            const l_in = l_cm / CM_TO_INCH;
            const h_in = h_cm / CM_TO_INCH;
            const diag_cm_calc = Math.sqrt(Math.pow(l_cm, 2) + Math.pow(h_cm, 2));
            const diag_in_calc = diag_cm_calc / CM_TO_INCH;
            const area_cm2 = l_cm * h_cm;
            const area_in2 = l_in * h_in;

            // Aspect Ratio Calculation
            const commonDivisor = gcd(l_cm, h_cm);
            let aspectRatioText = '--'; // Default to '--'
            if (commonDivisor !== 1 || (l_cm > 0 && h_cm > 0)) { // Calculate only if gcd makes sense or L/H are positive
               const ratioL = l_cm / commonDivisor;
               const ratioH = h_cm / commonDivisor;
               aspectRatioText = `${formatNumberRatio(ratioL)}:${formatNumberRatio(ratioH)}`;

               // Try common ratios (adjust precision checks as needed)
               const ratioDecimal = h_cm === 0 ? Infinity : l_cm / h_cm; // Avoid division by zero
               if (Math.abs(ratioDecimal - 16 / 9) < 0.02) aspectRatioText = "16:9";
               else if (Math.abs(ratioDecimal - 4 / 3) < 0.02) aspectRatioText = "4:3";
               else if (Math.abs(ratioDecimal - 21 / 9) < 0.02) aspectRatioText = "21:9";
               else if (Math.abs(ratioDecimal - 32 / 9) < 0.03) aspectRatioText = "32:9";
               else if (Math.abs(ratioDecimal - 1) < 0.01) aspectRatioText = "1:1";
               else if (Math.abs(ratioDecimal - 3 / 2) < 0.02) aspectRatioText = "3:2";
               // Keep the calculated simplified ratio if none match closely
           }


            // Display Calculated Results
            outputL.textContent = formatNumber(l_in);
            outputH.textContent = formatNumber(h_in);
            outputDiagCmCalc.textContent = formatNumber(diag_cm_calc);
            outputDiagInCalc.textContent = formatNumber(diag_in_calc);
            outputAspectRatio.textContent = aspectRatioText;
            outputAreaCm2.textContent = formatNumber(area_cm2);
            outputAreaIn2.textContent = formatNumber(area_in2);

            // --- Determine Final Diagonal ---
            final_diag_in = diag_in_calc; // Default to calculated

            // Check optional measured diagonal input
            if (diag_cm_measured_input !== '') {
                if (isNaN(diag_cm_measured) || diag_cm_measured <= 0) {
                    errorMessages.push(currentTexts.errorMsgDiag);
                    // Don't set hasBlockingError here, just add the error message.
                    // L/H calculations might still be valid.
                } else {
                    final_diag_in = diag_cm_measured / CM_TO_INCH;
                    // Optional: Add a warning if measured differs significantly from calculated
                    // if (Math.abs(final_diag_in - diag_in_calc) > 0.5) { /* Add non-blocking warning */ }
                }
            }
             // Display Final Result (only if calculable and no *diagonal* error)
            if (!isNaN(final_diag_in) && !errorMessages.includes(currentTexts.errorMsgDiag)) {
                outputFinalInches.textContent = formatNumber(final_diag_in, 1); // Use 1 decimal for final size
            } else {
                 outputFinalInches.textContent = '--';
            }

        } // End of calculations block (if !hasBlockingError)

        // --- Display Errors ---
        errorMessageDiv.textContent = errorMessages.join(' '); // Join multiple errors if necessary
        errorMessageDiv.style.display = errorMessages.length > 0 ? 'block' : 'none'; // Show div only if there are errors

        // --- Enable/Disable Copy Buttons ---
        copyButtons.forEach(btn => {
            const targetSelector = btn.dataset.clipboardTarget;
            if (!targetSelector) return; // Skip if data attribute is missing

            const targetElement = document.querySelector(targetSelector);
            // Enable if the target element exists AND its content is not '--'
            if (targetElement && targetElement.textContent !== '--') {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        });
    } // --- End of calculateConversion function ---

    // --- Event Listeners ---
    cmInputL.addEventListener('input', calculateConversion);
    cmInputH.addEventListener('input', calculateConversion);
    cmInputDiag.addEventListener('input', calculateConversion);
    btnFr.addEventListener('click', () => updateTexts('fr'));
    btnEn.addEventListener('click', () => updateTexts('en'));

    // Reset Button Listener
    resetButton.addEventListener('click', () => {
        cmInputL.value = '';
        cmInputH.value = '';
        cmInputDiag.value = '';
        calculateConversion(); // Recalculate to clear outputs, errors, and reset button states
    });

    // Copy Button Listeners
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetButton = event.currentTarget; // Use currentTarget for reliability
            const targetSelector = targetButton.dataset.clipboardTarget;
            const currentLang = htmlTag.lang || 'fr';
            const currentTexts = texts[currentLang];

            if (!targetSelector) return; // Skip if attribute missing

            const targetElement = document.querySelector(targetSelector);

            // Check if element exists, content is valid, and button is not already disabled
            if (targetElement && targetElement.textContent !== '--' && !targetButton.disabled) {
                const valueToCopy = targetElement.textContent;

                navigator.clipboard.writeText(valueToCopy).then(() => {
                    // Success feedback
                    const originalText = currentTexts.copyButton;
                    targetButton.textContent = currentTexts.copiedButton; // "Copied!"
                    targetButton.classList.add('copied');
                    targetButton.classList.remove('copy-error');
                    targetButton.disabled = true; // Temporarily disable

                    // Reset button text after a delay
                    setTimeout(() => {
                         // Check if button still exists in the DOM before resetting
                         if(document.body.contains(targetButton)) {
                            targetButton.textContent = originalText;
                            targetButton.classList.remove('copied');
                            // Re-enable button ONLY IF the value is still valid (check via calculateConversion)
                            calculateConversion(); // Re-run calculation logic to reset states correctly
                         }
                    }, 1500); // 1.5 seconds

                }).catch(err => {
                    console.error('Clipboard copy failed:', err);
                    // Provide visual error feedback on the button itself
                    const originalText = currentTexts.copyButton;
                    targetButton.textContent = currentTexts.copyError; // Indicate error
                    targetButton.classList.add('copy-error');
                    targetButton.classList.remove('copied');
                    targetButton.disabled = true; // Temporarily disable

                    // Reset button after a longer delay for error
                     setTimeout(() => {
                         if(document.body.contains(targetButton)) {
                            targetButton.textContent = originalText;
                            targetButton.classList.remove('copy-error');
                             // Re-evaluate button state
                            calculateConversion();
                         }
                    }, 2500); // 2.5 seconds for error message

                    // Optionally display a more prominent user-facing error message
                    // alert(currentTexts.copyError + ' Please try again or copy manually.');
                });
            }
        });
    });

    // --- Initial Setup ---
    // Optional: Remember language preference
    const initialLang = localStorage.getItem('converterLang') || navigator.language.split('-')[0] || 'fr'; // Use stored, browser lang, or default to fr
    updateTexts(initialLang);

    // Optional: Save language preference on change
    btnFr.addEventListener('click', () => localStorage.setItem('converterLang', 'fr'));
    btnEn.addEventListener('click', () => localStorage.setItem('converterLang', 'en'));

}); // --- End of DOMContentLoaded ---
// --- END OF FILE converter_script.js ---