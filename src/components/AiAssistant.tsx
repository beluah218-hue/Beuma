import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, CornerDownRight, AlertCircle } from "lucide-react";
import { Language } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AiAssistantProps {
  language: Language;
}

export default function AiAssistant({ language }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: language === "ta" 
        ? "வணக்கம்! நான் உங்கள் ஊராட்சி AI உதவியாளர். கிராம பிரச்சனைகள் அல்லது அவற்றின் தீர்வுகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்!"
        : "Hello! I am your local village AI assistant. Ask me anything about reported complaints, street statuses, or Panchayat services!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle language switch greeting updates
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          role: "model",
          text: language === "ta" 
            ? "வணக்கம்! நான் உங்கள் ஊராட்சி AI உதவியாளர். கிராம பிரச்சனைகள் அல்லது அவற்றின் தீர்வுகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்!"
            : "Hello! I am your local village AI assistant. Ask me anything about reported complaints, street statuses, or Panchayat services!"
        }
      ]);
    }
  }, [language]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: language,
          history: messages.slice(1) // exclude first greeting if not needed or pass all
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: "model", text: data.reply }]);
      } else {
        throw new Error("Chat response failed");
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          text: language === "ta"
            ? "மன்னிக்கவும், எனது சேவையுடன் இணைப்பதில் சிக்கல் ஏற்பட்டது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
            : "I'm sorry, I'm having trouble connecting to the service. Please try again in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const PRESET_PROMPTS = language === "ta" ? [
    "சாலையில் உள்ள பள்ளம் எப்போது சரிசெய்யப்படும்?",
    "நமது கிராமத்தின் மொத்தப் புகார்கள் எவ்வளவு?",
    "புதிய புகாரை எவ்வாறு பதிவு செய்வது?"
  ] : [
    "When will the potholes on Main Street be fixed?",
    "How many active issues are there in Ward 3?",
    "How can I report a new street issue?"
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/50">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>{language === "ta" ? "ஊராட்சி AI உதவியாளர்" : "Panchayat AI Assistant"}</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {language === "ta" ? "உடனடி உதவி மற்றும் நிலை" : "Instant Support & Live Status"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="h-60 overflow-y-auto px-1 space-y-3 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "user" 
                ? "bg-primary/10 text-primary" 
                : "bg-indigo-50 text-indigo-600"
            }`}>
              {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-white rounded-tr-none"
                : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100/50"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-gray-50 text-gray-500 p-3 rounded-2xl rounded-tl-none border border-gray-100/50 flex items-center gap-1 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset prompt pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInput(prompt);
            }}
            className="text-[10px] bg-indigo-50/40 border border-indigo-100/40 text-indigo-700 hover:bg-indigo-50 py-1 px-2.5 rounded-full transition-colors font-semibold"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSendMessage} className="flex gap-2 items-center pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === "ta" ? "உங்கள் கேள்வியைத் தட்டச்சு செய்க..." : "Ask about street problems..."}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 font-medium text-gray-800"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
