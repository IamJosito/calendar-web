import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import english from "./Locales/en.json";
import spanish from "./Locales/es.json";

// the translations
const resources = {
  en: {
    translation: english,
  },
  es: {
    translation: spanish,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
