import React, { useState, useEffect } from "react";
import { CheckCircle2, Award, Zap, Sparkles } from "lucide-react";
import { Language } from "../types";
import { TRANSLATIONS } from "../data";

interface StatsBannerProps {
  language: Language;
  resolvedCount: number;
}

export default function StatsBanner({ language, resolvedCount }: StatsBannerProps) {
  const t = TRANSLATIONS[language];
  const [tickerIndex, setTickerIndex] = useState(0);

  const localAccomplishments = {
    en: [
      "Water pump repaired on Temple Street - Water restored!",
      "5 non-working streetlights replaced on Main Road with energy-saving LEDs.",
      "Dangerous fallen tree cleared near Bus Stand Area within 4 hours.",
      "Mosquito fogging campaign completed in Ward 2 and Ward 3.",
    ],
    ta: [
      "கோவில் தெருவில் குடிநீர் பம்ப் சரிசெய்யப்பட்டது - குடிநீர் விநியோகம் சீரானது!",
      "மெயின் ரோட்டில் எரியாத 5 தெருவிளக்குகள் புதிய எல்இடி விளக்குகளாக மாற்றப்பட்டன.",
      "பேருந்து நிலையம் அருகே விழுந்த ஆபத்தான மரம் 4 மணி நேரத்தில் அகற்றப்பட்டது.",
      "வார்டு 2 மற்றும் வார்டு 3-ல் கொசு ஒழிப்பு மருந்து தெளிக்கும் பணி நிறைவடைந்தது.",
    ],
  };

  const currentTicker = localAccomplishments[language] || localAccomplishments["en"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % currentTicker.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentTicker.length]);

  return (
    <div className="w-full bg-linear-to-r from-primary-light to-primary text-white py-2.5 px-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md border border-white/10 my-4 overflow-hidden">
      {/* Solved Stat */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center pulse-indicator shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider leading-none">
            {t.solvedBadge}
          </p>
          <p className="text-sm font-extrabold text-white flex items-center gap-1">
            <span>{resolvedCount + 1240}</span>
            <span className="text-emerald-300 font-normal text-xs">Issues Solved</span>
          </p>
        </div>
      </div>

      {/* Ticker scrolling text */}
      <div className="flex items-center gap-2 overflow-hidden w-full max-w-xl bg-black/15 py-1.5 px-3.5 rounded-xl border border-white/5">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
        <div className="text-xs font-semibold text-gray-100 truncate animate-fade-in">
          <span className="font-bold text-amber-400 mr-1.5">
            [Recent Solution]:
          </span>
          {currentTicker[tickerIndex]}
        </div>
      </div>

      {/* Citizen Trust Badge */}
      <div className="hidden lg:flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold shrink-0 border border-amber-400/30">
        <Award className="w-3.5 h-3.5" />
        <span>Panchayat Certified</span>
      </div>
    </div>
  );
}
