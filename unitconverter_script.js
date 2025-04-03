// unitconverter_script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const categorySelect = document.getElementById("categorySelect");
    const valueInput = document.getElementById("valueInput");
    const fromUnitSelect = document.getElementById("fromUnitSelect");
    const toUnitSelect = document.getElementById("toUnitSelect");
    const convertButton = document.getElementById("convertButton");
    const resultDisplay = document.getElementById("resultDisplay");
    const errorDisplay = document.getElementById("errorDisplay");

    // --- Conversion Data ---
    const conversions = {
        length: {
            // Base unit: meters
            units: {
                Meters: 1,
                Kilometers: 0.001,
                Centimeters: 100,
                Millimeters: 1000,
                Miles: 0.000621371,
                Feet: 3.28084,
                Inches: 39.3701,
                Yards: 1.09361
            },
            base: "Meters"
        },
        weight: {
            // Base unit: kilograms
            units: {
                Kilograms: 1,
                Grams: 1000,
                Milligrams: 1000000,
                Pounds: 2.20462,
                Ounces: 35.274,
                MetricTons: 0.001
            },
            base: "Kilograms"
        },
        temperature: {
            // Temperature units - special handling required
            units: ["Celsius", "Fahrenheit", "Kelvin"],
            // Conversion function handles logic
            convert: function(value, from, to) {
                if (from === to) return value;

                let celsiusValue;

                // 1. Convert FROM 'from' unit TO Celsius
                switch (from) {
                    case "Celsius":
                        celsiusValue = value;
                        break;
                    case "Fahrenheit":
                        celsiusValue = (value - 32) * 5 / 9;
                        break;
                    case "Kelvin":
                        celsiusValue = value - 273.15;
                        break;
                    default:
                        return NaN; // Invalid 'from' unit
                }

                // 2. Convert FROM Celsius TO 'to' unit
                let resultValue;
                switch (to) {
                    case "Celsius":
                        resultValue = celsiusValue;
                        break;
                    case "Fahrenheit":
                        resultValue = (celsiusValue * 9 / 5) + 32;
                        break;
                    case "Kelvin":
                        resultValue = celsiusValue + 273.15;
                        break;
                    default:
                        return NaN; // Invalid 'to' unit
                }
                return resultValue;
            }
        }
        // Add more categories here (e.g., volume, speed) following the 'length'/'weight' pattern
        // or the 'temperature' pattern if direct factors aren't applicable.
    };

    // --- Helper Functions ---

    function clearResultAndError() {
        resultDisplay.textContent = "Result: ";
        errorDisplay.textContent = "";
        errorDisplay.style.display = "none";
    }

    function displayError(message) {
        errorDisplay.textContent = message;
        errorDisplay.style.display = "block";
        resultDisplay.textContent = "Result: "; // Clear result on error
    }

    // --- Core Functions ---

    function updateUnits() {
        const category = categorySelect.value;
        const fromUnitOptions = [];
        const toUnitOptions = [];

        // Clear previous options
        fromUnitSelect.innerHTML = "";
        toUnitSelect.innerHTML = "";
        clearResultAndError(); // Clear results when category changes

        let unitList;
        if (category === "temperature") {
            unitList = conversions.temperature.units;
        } else if (conversions[category] && conversions[category].units) {
            // Get units from the 'units' sub-object for other categories
            unitList = Object.keys(conversions[category].units);
        } else {
            console.error("Invalid category selected or category data missing:", category);
            displayError("Selected category is not configured.");
            return;
        }

        // Populate dropdowns
        unitList.forEach(unit => {
            const optionFrom = document.createElement("option");
            optionFrom.value = unit;
            optionFrom.textContent = unit; // Use the key name directly
            fromUnitSelect.appendChild(optionFrom);

            const optionTo = document.createElement("option");
            optionTo.value = unit;
            optionTo.textContent = unit;
            toUnitSelect.appendChild(optionTo);
        });

        // Select different default units if possible for better UX
        if (fromUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }

    function performConversion() {
        clearResultAndError(); // Clear previous state first

        const category = categorySelect.value;
        const valueStr = valueInput.value.trim();
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        let result;

        // Validate input value
        if (valueStr === "") {
             // Don't show error if empty, just no result
             resultDisplay.textContent = "Result: ";
             return;
        }

        const value = parseFloat(valueStr);
        if (isNaN(value)) {
            displayError("Please enter a valid number for the value.");
            return;
        }

         // Check if units are selected (should always be if populated correctly)
         if (!fromUnit || !toUnit) {
             displayError("Please select 'From' and 'To' units.");
             return;
         }

        try {
            if (category === "temperature") {
                result = conversions.temperature.convert(value, fromUnit, toUnit);
            } else if (conversions[category] && conversions[category].units && conversions[category].base) {
                // Linear conversions (length, weight, etc.) using base unit factors
                const categoryData = conversions[category];
                const fromFactor = categoryData.units[fromUnit];
                const toFactor = categoryData.units[toUnit];

                if (typeof fromFactor === 'undefined' || typeof toFactor === 'undefined') {
                   throw new Error("Unit factors not found for conversion.");
                }

                 // Convert input value to base unit (handle division by zero for factor 0, though unlikely here)
                const baseValue = fromFactor === 0 ? 0 : value / fromFactor;
                // Convert base unit value to target unit
                result = baseValue * toFactor;
            } else {
                throw new Error("Conversion logic for this category is not implemented.");
            }

            // Check for valid result after conversion
            if (isNaN(result)) {
                 throw new Error("Conversion resulted in an invalid number.");
            }

            // Display result, formatted to a reasonable number of decimal places
            // Adjust precision based on expected magnitude or category if needed
            const precision = (Math.abs(result) > 0.0001 || result === 0) ? 6 : 10; // More precision for very small numbers
            const formattedResult = Number(result.toFixed(precision)); // Use toFixed for rounding, Number() removes trailing zeros

            resultDisplay.textContent = `Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`;

        } catch (error) {
            console.error("Conversion Error:", error);
            displayError(`Calculation error: ${error.message || 'Could not perform conversion.'}`);
        }
    }

    // --- Event Listeners ---
    categorySelect.addEventListener("change", updateUnits);
    convertButton.addEventListener("click", performConversion);

    // Optional: Convert on Enter key press in the value input field
    valueInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent potential form submission if wrapped in <form>
            performConversion();
        }
    });

    // --- Initial Setup ---
    updateUnits(); // Populate units for the default category on page load

});