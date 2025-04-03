// converter_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const cmInputL = document.getElementById('cmInputL');
    const cmInputH = document.getElementById('cmInputH');
    const cmInputDiag = document.getElementById('cmInputDiag');
    const outputL = document.getElementById('outputL');
    const outputH = document.getElementById('outputH');
    const outputDiagCmCalc = document.getElementById('outputDiagCmCalc');
    const outputDiagInCalc = document.getElementById('outputDiagInCalc');
    const outputFinalInches = document.getElementById('outputFinalInches');
    const outputAspectRatio = document.getElementById('outputAspectRatio'); // New
    const outputAreaCm2 = document.getElementById('outputAreaCm2');       // New
    const outputAreaIn2 = document.getElementById('outputAreaIn2');       // New
    const errorMessageDiv = document.getElementById('error-message-converter');
    const resetButton = document.getElementById('resetButtonConverter');   // New
    const copyButtons = document.querySelectorAll('.copy-button');       // New

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
    const labelResAspectRatio = document.getElementById('label-res-aspect-ratio'); // New
    const labelResAreaCm = document.getElementById('label-res-area-cm');           // New
    const labelResAreaIn = document.getElementById('label-res-area-in');           // New
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');
    const htmlTag = document.documentElement;

    // --- Constants & Helpers ---
    const CM_TO_INCH = 2.54;
    const formatNumber = (num, decimals = 2) => num.toFixed(decimals);
    // Greatest Common Divisor function
    function gcd(a, b) {
        a = Math.abs(Math.round(a * 100)); // Work with integers (scaled) for precision
        b = Math.abs(Math.round(b * 100));
        if (b === 0) return a / 100; // Scale back down
        while (b) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a / 100; // Scale back down
    }

    const texts = {
        fr: {
            // ... (Existing translations) ...
            backButton: "← Retour à l'accueil",
            labelResAspectRatio: "Ratio d'Aspect (L:H):",
            labelResAreaCm: "Surface:",
            labelResAreaIn: "Surface:",
            unitCm2: "cm²",
            unitIn2: "pouces²",
            resetButton: "Effacer",
            copyButton: "Copier",
            copiedButton: "Copié !"
            // ... (Error messages) ...
        },
        en: {
             // ... (Existing translations) ...
            backButton: "← Back to Home",
            labelResAspectRatio: "Aspect Ratio (W:H):",
            labelResAreaCm: "Area:",
            labelResAreaIn: "Area:",
            unitCm2: "cm²",
            unitIn2: "inches²",
            resetButton: "Reset",
            copyButton: "Copy",
            copiedButton: "Copied!",
            // ... (Error messages) ...
        }
    };

    function updateTexts(lang) {
        htmlTag.lang = lang;
        const currentTexts = texts[lang];
        // ... (Update existing elements: title, labels, placeholders, buttons, etc.) ...
        pageTitle.textContent = currentTexts.title;
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

        // Update NEW elements
        labelResAspectRatio.textContent = currentTexts.labelResAspectRatio;
        labelResAreaCm.textContent = currentTexts.labelResAreaCm;
        labelResAreaIn.textContent = currentTexts.labelResAreaIn;
        resetButton.textContent = currentTexts.resetButton;
        btnFr.setAttribute('aria-pressed', lang === 'fr');
        btnEn.setAttribute('aria-pressed', lang === 'en');


        // Update units dynamically (including new units)
        document.querySelectorAll('.results-grid .unit').forEach(span => {
            const parentDd = span.closest('dd');
            if (!parentDd) return; // Should not happen

            const prevDt = parentDd.previousElementSibling;
            if (!prevDt || !prevDt.id) return;

            if (prevDt.id.includes('Cm') && !prevDt.id.includes('Area')) { span.textContent = currentTexts.unitCm; }
            else if (prevDt.id.includes('AreaCm')) { span.textContent = currentTexts.unitCm2; } // cm²
            else if (prevDt.id.includes('AreaIn')) { span.textContent = currentTexts.unitIn2; } // inches²
            else { span.textContent = currentTexts.unitIn; } // Default to inches
        });
         // Update unit for final inches result separately
         outputFinalInches.nextElementSibling.textContent = currentTexts.unitIn;


        // Update copy buttons text (resetting 'copied' state)
        copyButtons.forEach(btn => {
            btn.textContent = currentTexts.copyButton;
            btn.classList.remove('copied');
        });


        btnFr.classList.toggle('active', lang === 'fr');
        btnEn.classList.toggle('active', lang === 'en');

        calculateConversion(); // Recalculate in case error messages need translation
    }


    function calculateConversion() {
        // ... (Read inputs l_cm, h_cm, diag_cm_measured as before) ...
        const l_cm = parseFloat(cmInputL.value);
        const h_cm = parseFloat(cmInputH.value);
        const diag_cm_measured_input = cmInputDiag.value;
        const diag_cm_measured = parseFloat(diag_cm_measured_input);
        const currentLang = htmlTag.lang || 'fr';
        let errorMessages = [];

        // --- Reset Outputs ---
        outputL.textContent = '--';
        outputH.textContent = '--';
        outputDiagCmCalc.textContent = '--';
        outputDiagInCalc.textContent = '--';
        outputFinalInches.textContent = '--';
        outputAspectRatio.textContent = '--'; // Reset new
        outputAreaCm2.textContent = '--';     // Reset new
        outputAreaIn2.textContent = '--';     // Reset new
        errorMessageDiv.style.display = 'none';

         // --- Reset Copy Button States ---
         copyButtons.forEach(btn => {
            const targetId = btn.dataset.clipboardTarget.substring(1); // Enlève #
            let ariaLabelBase = "Copier ";
            if (lang === 'en') ariaLabelBase = "Copy ";

            // Trouver le label correspondant (simplification, peut être amélioré)
            let labelText = targetId; // Fallback
            if (targetId === 'outputFinalInches') labelText = currentTexts.labelFinalSize;
            else if (targetId === 'outputL') labelText = currentTexts.labelResL;
            else if (targetId === 'outputH') labelText = currentTexts.labelResH;
            else if (targetId === 'outputDiagInCalc') labelText = currentTexts.labelResDiagInCalc;
            // Enlever les ":" à la fin si présents
            labelText = labelText.replace(':', '');

            btn.setAttribute('aria-label', ariaLabelBase + labelText);
            // Reset copy button text/state
             btn.textContent = currentTexts.copyButton;
             btn.classList.remove('copied');
        });
        // --- Validate L and H ---
        if (isNaN(l_cm) || isNaN(h_cm) || l_cm <= 0 || h_cm <= 0) {
            // ... (Error handling as before) ...
            if ((cmInputL.value && (isNaN(l_cm) || l_cm <= 0)) || (cmInputH.value && (isNaN(h_cm) || h_cm <= 0))) {
                 errorMessages.push(texts[currentLang].errorMsgLh);
            }
             errorMessageDiv.textContent = errorMessages.join(' ');
             errorMessageDiv.style.display = errorMessages.length > 0 ? 'block' : 'none';
            return;
        }

        // --- Calculations (L/H based) ---
        const l_in = l_cm / CM_TO_INCH;
        const h_in = h_cm / CM_TO_INCH;
        const diag_cm_calc = Math.sqrt(Math.pow(l_cm, 2) + Math.pow(h_cm, 2));
        const diag_in_calc = diag_cm_calc / CM_TO_INCH;
        const area_cm2 = l_cm * h_cm; // New
        const area_in2 = l_in * h_in; // New

        // Aspect Ratio Calculation
        const commonDivisor = gcd(l_cm, h_cm);
        let aspectRatioText = `${(l_cm / commonDivisor).toFixed(1)}:${(h_cm / commonDivisor).toFixed(1)}`;
         // Try common ratios (adjust precision as needed)
        const ratioDecimal = l_cm / h_cm;
        if (Math.abs(ratioDecimal - 16/9) < 0.02) aspectRatioText = "16:9";
        else if (Math.abs(ratioDecimal - 4/3) < 0.02) aspectRatioText = "4:3";
        else if (Math.abs(ratioDecimal - 21/9) < 0.02) aspectRatioText = "21:9";
        else if (Math.abs(ratioDecimal - 1) < 0.01) aspectRatioText = "1:1";
        else if (Math.abs(ratioDecimal - 3/2) < 0.02) aspectRatioText = "3:2";
        // Add more common ratios if desired...
        else { // Fallback to simplified decimal ratio if not a common one
           aspectRatioText = `${(l_cm / commonDivisor).toFixed(1)}:${(h_cm / commonDivisor).toFixed(1)}`;
        }


        // --- Display Calculated Results ---
        outputL.textContent = formatNumber(l_in);
        outputH.textContent = formatNumber(h_in);
        outputDiagCmCalc.textContent = formatNumber(diag_cm_calc);
        outputDiagInCalc.textContent = formatNumber(diag_in_calc);
        outputAspectRatio.textContent = aspectRatioText; // Display new
        outputAreaCm2.textContent = formatNumber(area_cm2); // Display new
        outputAreaIn2.textContent = formatNumber(area_in2); // Display new

        // --- Determine and Display Final Diagonal ---
        let final_diag_in = diag_in_calc;
         if (diag_cm_measured_input.trim() !== '') {
             if (isNaN(diag_cm_measured) || diag_cm_measured <= 0) {
                 errorMessages.push(texts[currentLang].errorMsgDiag);
             } else {
                 final_diag_in = diag_cm_measured / CM_TO_INCH;
                  // Optional consistency warning (as before)
             }
         }

        // --- Display Final Result & Errors ---
        if (errorMessages.length === 0 || !errorMessages.includes(texts[currentLang].errorMsgDiag)) {
            outputFinalInches.textContent = final_diag_in.toFixed(1);
             // Enable copy buttons for valid results
             copyButtons.forEach(btn => { btn.disabled = false; });
        } else {
            outputFinalInches.textContent = '--';
        }
         
         const resultsAreValid = errorMessages.length === 0 || !errorMessages.includes(texts[currentLang].errorMsgDiag);
         copyButtons.forEach(btn => {
            // Activer seulement si le résultat correspondant n'est pas '--' ET qu'il n'y a pas d'erreur bloquante
            const targetSelector = btn.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetSelector);
            btn.disabled = !resultsAreValid || !targetElement || targetElement.textContent === '--';
         });
         errorMessageDiv.textContent = errorMessages.join(' ');
         errorMessageDiv.style.display = errorMessages.length > 0 ? 'block' : 'none';
    }
    
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
        calculateConversion(); // Recalculate to clear outputs and errors
    });

    // Copy Button Listeners (Event Delegation could be slightly cleaner)
    copyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetSelector = event.target.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetSelector);
            if (targetElement && targetElement.textContent !== '--') {
                const valueToCopy = targetElement.textContent;
                navigator.clipboard.writeText(valueToCopy).then(() => {
                    // Success feedback
                    const originalText = texts[htmlTag.lang || 'fr'].copyButton;
                    event.target.textContent = texts[htmlTag.lang || 'fr'].copiedButton;
                    event.target.classList.add('copied');
                    event.target.disabled = true; // Disable briefly

                    // Reset button text after a delay
                    setTimeout(() => {
                        event.target.textContent = originalText;
                        event.target.classList.remove('copied');
                        event.target.disabled = false; // Re-enable
                    }, 1500); // 1.5 seconds
                }).catch(err => {
                    console.error('Erreur de copie:', err);
                    // Optionally display an error message to the user
                });
            }
        });
    });

    // --- Initial Setup ---
    updateTexts('fr');
});