import React from "react";
import { Language } from "../types";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "ta", name: "தமிழ்" },
  ];

  return (
    <div className="relative group">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs cursor-pointer hover:bg-gray-50 transition-colors">
        <Languages className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-gray-700">
          {languages.find((l) => l.code === currentLanguage)?.name}
        </span>
      </div>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-primary-light/5 transition-colors ${
              currentLanguage === lang.code
                ? "text-primary bg-primary/5 font-bold"
                : "text-gray-700"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
