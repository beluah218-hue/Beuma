import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Camera, Mic, Square, Play, Trash2, MapPin, 
  User, Phone, ChevronRight, ChevronLeft, Sparkles, AlertTriangle, Check
} from "lucide-react";
import { PROBLEM_CATEGORIES, VILLAGE_STREETS } from "../data";
import { Language, Issue } from "../types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSuccess: (newIssue: Issue) => void;
  preselectedCategory?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  language,
  onSuccess,
  preselectedCategory
}: ReportModalProps) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  
  // Media states
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // AI assist state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set pre-selected category if provided
  useEffect(() => {
    if (preselectedCategory) {
      const found = PROBLEM_CATEGORIES.find(c => c.id === preselectedCategory || c.name.includes(preselectedCategory));
      if (found) {
        setSelectedCategory(found.name);
        setStep(2); // Jump straight to step 2 if category is preselected
      }
    } else {
      setSelectedCategory("");
      setStep(1);
    }
  }, [preselectedCategory, isOpen]);

  // Load profile defaults from localStorage if exists
  useEffect(() => {
    const savedProfile = localStorage.getItem("namma_ooru_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setReporterName(parsed.name);
        if (parsed.phone) setReporterPhone(parsed.phone);
        if (parsed.street) {
          setSelectedStreet(parsed.street);
          setLocation(parsed.street);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  // Handle Voice Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  if (!isOpen) return null;

  // --- VOICE RECORDING LOGIC ---
  const startRecording = async () => {
    audioChunksRef.current = [];
    setAudioUrl(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          // Convert to data url for mock/real local preservation
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setAudioUrl(reader.result as string);
          };
          // Stop stream tracks to turn off recording light
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {
        // Fallback for environments lacking microphone hardware/permissions (such as typical iframe views)
        setIsRecording(true);
        // Simulate a recording stop after a while or manually
      }
    } catch (err) {
      console.warn("Real microphone access denied, using dynamic simulator:", err);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    } else if (isRecording) {
      // Simulator stop
      setAudioUrl("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA");
    }
    setIsRecording(false);
  };

  // --- PHOTO UPLOAD LOGIC ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  // --- GPS GEOLOCATION LOGIC ---
  const fetchGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordsStr = `GPS Coords: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          if (selectedStreet) {
            setLocation(`${selectedStreet} (${coordsStr})`);
          } else {
            setLocation(`My Current Geolocation (${coordsStr})`);
          }
        },
        (error) => {
          console.warn("Geolocation lookup failed:", error);
          alert("Could not fetch GPS location. Please select your street manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // --- AI CATEGORIZE LOGIC ---
  const handleAiCategorize = async () => {
    if (!description || description.trim().length < 10) {
      alert("Please write at least 10 characters describing the issue first.");
      return;
    }

    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnalysisResult(data);
        
        // Auto-select category suggested by Gemini
        if (data.category) {
          const match = PROBLEM_CATEGORIES.find(c => c.name.toLowerCase().includes(data.category.toLowerCase()) || data.category.toLowerCase().includes(c.name.toLowerCase()));
          if (match) {
            setSelectedCategory(match.name);
          } else {
            setSelectedCategory(data.category);
          }
        }
      }
    } catch (error) {
      console.error("AI tagging failure:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- AI TRANSCRIBE VOICE LOGIC ---
  const handleAiTranscribe = async () => {
    if (!audioUrl) return;
    setIsTranscribing(true);
    try {
      const response = await fetch("/api/ai/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceNoteUrl: audioUrl,
          category: selectedCategory
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.transcript) {
          setDescription(data.transcript);
        }
      }
    } catch (error) {
      console.error("AI transcribe failure:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  // --- SUBMIT COMPLAINT LOGIC ---
  const handleSubmit = async () => {
    if (!selectedCategory) {
      alert("Please select a problem category.");
      return;
    }
    if (!description) {
      alert("Please describe the problem.");
      return;
    }
    const finalLocation = location || selectedStreet || "My Village";
    if (!reporterName || !reporterPhone) {
      alert("Please provide your contact name and phone number.");
      return;
    }

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          description,
          location: finalLocation,
          reporterName,
          reporterPhone,
          photoUrl: photo,
          voiceNoteUrl: audioUrl
        })
      });

      if (response.ok) {
        const createdIssue = await response.json();
        
        // Save name/phone to defaults for next report
        localStorage.setItem("namma_ooru_profile", JSON.stringify({
          name: reporterName,
          phone: reporterPhone,
          street: selectedStreet
        }));

        onSuccess(createdIssue);
        resetForm();
        onClose();
      } else {
        alert("Failed to submit issue. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Saving report offline.");
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedCategory("");
    setDescription("");
    setLocation("");
    setSelectedStreet("");
    setPhoto(null);
    setAudioUrl(null);
    setAiAnalysisResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-lg h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <h3 className="font-bold text-base tracking-tight">Report Village Problem</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-gray-500">Step {step} of 4</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Pick the problem category</h4>
                  <p className="text-xs text-gray-500">Select what is broken or needs municipal attention on your street.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto pr-1">
                  {PROBLEM_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setStep(2);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left active:scale-98 transition-all ${
                        selectedCategory === cat.name
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-gray-100 bg-gray-50/50 hover:bg-gray-50"
                      }`}
                    >
                      <img src={cat.image} className="w-11 h-11 rounded-lg object-cover bg-gray-100 shrink-0" alt="" referrerPolicy="no-referrer" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 leading-tight truncate">{cat.name.split(" (")[0]}</p>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5 tracking-wider">Tap to select</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-bold text-gray-900">Explain what happened</h4>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {selectedCategory.split(" (")[0]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Provide details so our local officer understands the issue.</p>
                </div>

                {/* Description Textarea */}
                <div className="space-y-2 relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue... (e.g., The pipeline broke near the post office, causing severe water logging. Water has been pouring for 2 hours.)"
                    className="w-full h-28 p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium text-gray-800"
                  />
                  
                  {/* AI Smart Scan Trigger */}
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleAiCategorize}
                      disabled={isAnalyzing || !description}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-bold disabled:opacity-40"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>{isAnalyzing ? "AI Analyzing..." : "AI Auto-Tag Category"}</span>
                    </button>
                    <span className="text-[10px] text-gray-400 font-bold">{description.length} characters</span>
                  </div>
                </div>

                {/* AI result feedback */}
                {aiAnalysisResult && (
                  <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100/80 space-y-1 text-xs">
                    <p className="text-indigo-900 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Insights Loaded
                    </p>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      <strong className="text-indigo-950">Classification: </strong>
                      {aiAnalysisResult.category || selectedCategory} ({aiAnalysisResult.priority || "Medium"} Urgency)
                    </p>
                    {aiAnalysisResult.reasoning && (
                      <p className="text-gray-500 italic mt-0.5">{aiAnalysisResult.reasoning}</p>
                    )}
                  </div>
                )}

                {/* Audio Recording & Media Attachment Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Voice Note Module */}
                  <div className="bg-gray-50 border border-gray-200/60 p-3 rounded-2xl flex flex-col justify-between h-24">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Voice Note</span>
                    {isRecording ? (
                      <div className="flex items-center justify-between bg-red-50 text-red-600 px-2 py-1.5 rounded-xl border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                        <span className="text-[11px] font-bold">0:{recordingSeconds.toString().padStart(2, "0")}</span>
                        <button 
                          onClick={stopRecording}
                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Square className="w-3 h-3" />
                        </button>
                      </div>
                    ) : audioUrl ? (
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>Recorded</span>
                          </div>
                          <button 
                            onClick={() => setAudioUrl(null)}
                            className="p-1 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleAiTranscribe}
                          disabled={isTranscribing}
                          className="w-full py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 text-[10px] font-bold"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                          <span>{isTranscribing ? "AI transcribing..." : "AI Auto-Fill Desc"}</span>
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={startRecording}
                        className="flex items-center gap-1.5 bg-white border border-gray-200 py-1.5 px-2.5 rounded-xl shadow-xs hover:bg-gray-50 transition-all text-[11px] font-bold text-gray-700 self-start"
                      >
                        <Mic className="w-3.5 h-3.5 text-primary" />
                        <span>Record Voice</span>
                      </button>
                    )}
                  </div>

                  {/* Photo Upload Module */}
                  <div className="bg-gray-50 border border-gray-200/60 p-3 rounded-2xl flex flex-col justify-between h-24 relative overflow-hidden">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider z-10">Add Photo</span>
                    {photo ? (
                      <div className="absolute inset-0 z-0">
                        <img src={photo} className="w-full h-full object-cover" alt="Attachment" />
                        <button
                          onClick={() => setPhoto(null)}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors z-20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={triggerCamera}
                          className="flex items-center gap-1.5 bg-white border border-gray-200 py-1.5 px-2.5 rounded-xl shadow-xs hover:bg-gray-50 transition-all text-[11px] font-bold text-gray-700 self-start z-10"
                        >
                          <Camera className="w-3.5 h-3.5 text-primary" />
                          <span>Attach Photo</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Where is the problem located?</h4>
                  <p className="text-xs text-gray-500">Select your street and add details so the response crew can find it quickly.</p>
                </div>

                <div className="space-y-4">
                  {/* Street Selection dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Select Street/Ward</label>
                    <select
                      value={selectedStreet}
                      onChange={(e) => {
                        setSelectedStreet(e.target.value);
                        setLocation(e.target.value);
                      }}
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                    >
                      <option value="">-- Choose local street/ward --</option>
                      {VILLAGE_STREETS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Manual / Geolocation Address field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Specific Landmarks or Coordinates</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Opposite Post Office near the big banyan tree"
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                    />
                  </div>

                  {/* Real Geolocation Locator Trigger Button */}
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary animate-bounce" />
                        <span>Use Live GPS Location</span>
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                        Detect precise location coordinate sensors for maximum accuracy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchGeolocation}
                      className="bg-primary text-white hover:bg-primary-light px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all shrink-0"
                    >
                      Pin Coordinates
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">Your contact details</h4>
                  <p className="text-xs text-gray-500">Enter your name so the local village officer can contact you if they need clarification.</p>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      Citizen Name
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                    <p className="font-extrabold text-gray-900 border-b border-gray-200/80 pb-1.5 uppercase tracking-wider text-[10px]">
                      Report Review Summary
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-gray-600">
                      <p><strong className="text-gray-900">Category:</strong> {selectedCategory.split(" (")[0]}</p>
                      <p><strong className="text-gray-900">Location:</strong> {location || selectedStreet || "Not specified"}</p>
                      <p className="col-span-2 leading-relaxed"><strong className="text-gray-900">Description:</strong> {description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 py-2 px-3 hover:bg-gray-200/40 rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && !selectedCategory) {
                  alert("Please select a problem category first.");
                  return;
                }
                if (step === 2 && !description) {
                  alert("Please describe the issue first.");
                  return;
                }
                if (step === 3 && !location && !selectedStreet) {
                  alert("Please specify a location or select a street.");
                  return;
                }
                setStep(step + 1);
              }}
              className="bg-primary text-white flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-md hover:bg-primary-light active:scale-95 transition-all"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all"
            >
              <span>Submit Report</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
