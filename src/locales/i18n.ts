import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import tr from "./tr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: "en", // Varsayılan dil (İngilizce)
  fallbackLng: "en", // Hata durumunda dönülecek dil
  interpolation: {
    escapeValue: false, // React XSS korumasını zaten yapıyor
  },
});

export default i18n;
