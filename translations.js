const translations = {
    en: null, // Will be loaded dynamically
    fr: null,
    ja: null
};

let currentLanguage = 'en';

async function loadTranslation(lang) {
    if (!translations[lang]) {
        try {
            const response = await fetch(`translations/${lang}.json`);
            translations[lang] = await response.json();
        } catch (error) {
            console.error(`Failed to load ${lang} translation:`, error);
            return false;
        }
    }
    return true;
}

async function setLanguage(lang) {
    if (await loadTranslation(lang)) {
        currentLanguage = lang;
        translatePage();
        localStorage.setItem('language', lang);
    } else {
        console.error(`Failed to set language to ${lang}`);
    }
}

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLanguage][key] || key;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = translations[currentLanguage][key] || key;
    });
}

function detectLanguage() {
    const storedLang = localStorage.getItem('language');
    if (storedLang && translations.hasOwnProperty(storedLang)) {
        return storedLang;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return translations.hasOwnProperty(browserLang) ? browserLang : 'en';
}

// Initialize language
document.addEventListener('DOMContentLoaded', async () => {
    const detectedLang = detectLanguage();
    await setLanguage(detectedLang);
});