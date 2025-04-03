// --- START OF FILE hub_script.js ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const htmlTag = document.documentElement;
    const hubTitle = document.getElementById('hub-title');
    const tool1Title = document.getElementById('tool1-title');
    const tool1Desc = document.getElementById('tool1-desc');
    const tool1Button = document.getElementById('tool1-button');
    // IDs pour l'outil 2 (calculator) si ajouté
    // const tool2Title = document.getElementById('tool2-title');
    // const tool2Desc = document.getElementById('tool2-desc');
    // const tool2Button = document.getElementById('tool2-button');
    const tool3Title = document.getElementById('tool3-title'); // Unit Converter
    const tool3Desc = document.getElementById('tool3-desc');
    const tool3Button = document.getElementById('tool3-button');
    const hubFooterText = document.getElementById('hub-footer-text');
    const themeLabel = document.getElementById('theme-label'); // Pour le thème
    const btnFr = document.getElementById('lang-fr');
    const btnEn = document.getElementById('lang-en');

    // --- Language Data --- (COMPLÉTEZ AVEC VOS TRADUCTIONS)
    const texts = {
        fr: {
            pageTitle: "Mes Outils en Ligne",
            hubTitle: "Mes Outils en Ligne",
            tool1Title: "Convertisseur Taille Écran",
            tool1Desc: "Calculez la largeur, hauteur et diagonale de votre écran en pouces à partir des dimensions en centimètres.",
            tool1Button: "Utiliser le Convertisseur",
            // tool2Title: "Calculateur Produit en Croix",
            // tool2Desc: "Effectuez un calcul de produit en croix simple et rapide (A × B / C = D).",
            // tool2Button: "Utiliser le Calculateur",
            tool3Title: "Convertisseur d'Unités",
            tool3Desc: "Convertissez diverses unités comme la longueur, le poids/masse et la température.",
            tool3Button: "Utiliser le Convertisseur",
            hubFooterText: "© 2023 Vos Outils Pratiques", // Mettre à jour l'année si besoin
            themeLabel: "Mode Sombre"
        },
        en: {
            pageTitle: "My Online Tools",
            hubTitle: "My Online Tools",
            tool1Title: "Screen Size Converter",
            tool1Desc: "Calculate screen width, height, and diagonal in inches from dimensions in centimeters.",
            tool1Button: "Use Converter",
            // tool2Title: "Cross-Multiplication Calculator",
            // tool2Desc: "Perform a simple and quick cross-multiplication calculation (A × B / C = D).",
            // tool2Button: "Use Calculator",
            tool3Title: "Unit Converter",
            tool3Desc: "Convert various units like length, weight/mass, and temperature.",
            tool3Button: "Use Converter",
            hubFooterText: "© 2023 Your Practical Tools", // Update year if needed
            themeLabel: "Dark Mode"
        }
    };

    // --- Update UI Text ---
    function updateTexts(lang) {
        lang = texts[lang] ? lang : 'fr'; // Valide la langue, défaut 'fr'
        htmlTag.lang = lang;
        const currentTexts = texts[lang];

        // Met à jour les éléments texte
        document.title = currentTexts.pageTitle; // Titre de l'onglet
        if (hubTitle) hubTitle.textContent = currentTexts.hubTitle;
        if (tool1Title) tool1Title.textContent = currentTexts.tool1Title;
        if (tool1Desc) tool1Desc.textContent = currentTexts.tool1Desc;
        if (tool1Button) tool1Button.textContent = currentTexts.tool1Button;
        // if (tool2Title) tool2Title.textContent = currentTexts.tool2Title; // Décommenter si l'outil 2 existe
        // if (tool2Desc) tool2Desc.textContent = currentTexts.tool2Desc;
        // if (tool2Button) tool2Button.textContent = currentTexts.tool2Button;
        if (tool3Title) tool3Title.textContent = currentTexts.tool3Title;
        if (tool3Desc) tool3Desc.textContent = currentTexts.tool3Desc;
        if (tool3Button) tool3Button.textContent = currentTexts.tool3Button;
        if (hubFooterText) hubFooterText.textContent = currentTexts.hubFooterText;
        if (themeLabel) themeLabel.textContent = currentTexts.themeLabel;

        // Met à jour l'état des boutons de langue
        if (btnFr) {
            btnFr.classList.toggle('active', lang === 'fr');
            btnFr.setAttribute('aria-pressed', lang === 'fr');
        }
        if (btnEn) {
            btnEn.classList.toggle('active', lang === 'en');
            btnEn.setAttribute('aria-pressed', lang === 'en');
        }
    }

    // --- Event Listeners ---
    if (btnFr) {
        btnFr.addEventListener('click', () => {
            const targetLang = 'fr';
            updateTexts(targetLang);
            // Utilise une clé de stockage commune ou spécifique au hub
            localStorage.setItem('preferredLang', targetLang); // Clé commune
            // localStorage.setItem('hubLang', targetLang); // Clé spécifique
        });
    }
    if (btnEn) {
        btnEn.addEventListener('click', () => {
            const targetLang = 'en';
            updateTexts(targetLang);
            localStorage.setItem('preferredLang', targetLang); // Clé commune
            // localStorage.setItem('hubLang', targetLang); // Clé spécifique
        });
    }

    // --- Initial Setup ---
    // Utilise la clé commune 'preferredLang' si elle existe, sinon navigue, sinon 'fr'
    const initialLang = localStorage.getItem('preferredLang') || navigator.language.split('-')[0] || 'fr';
    updateTexts(initialLang);

}); // --- End of DOMContentLoaded ---
// --- END OF FILE hub_script.js ---