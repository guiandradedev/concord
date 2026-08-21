import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  void i18n.use(HttpBackend).use(LanguageDetector);
}

void i18n
  .use(initReactI18next)
  .init({
    ...(isBrowser ? {} : { lng: "en" }),
    fallbackLng: "en",
    supportedLngs: ["en", "pt-BR"],
    ns: ["common", "public"],
    defaultNS: "common",
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;   