import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, ClipboardList, User, ShieldAlert, CheckCircle2, 
  Volume2, Key, HelpCircle, Phone, Info, LayoutDashboard,
  Languages, Megaphone, Award, Landmark, MapPin, Check, Plus
} from "lucide-react";
import { Issue, UserProfile, Language } from "./types";
import { PROBLEM_CATEGORIES, TRANSLATIONS, VILLAGE_STREETS } from "./data";
import LanguageSelector from "./components/LanguageSelector";
import StatsBanner from "./components/StatsBanner";
import ReportModal from "./components/ReportModal";
import MyIssuesList from "./components/MyIssuesList";
import AdminPortal from "./components/AdminPortal";
import AiAssistant from "./components/AiAssistant";

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<"home" | "issues" | "profile">("home");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string | undefined>(undefined);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Grace",
    phone: "9844512345",
    village: "Namma Ooru My Village",
    ward: "School Ward 2",
    badges: [
      { id: "vigilant", title: "Vigilant Citizen", description: "Reported your first civic issue", icon: "Award", unlockedAt: "2026-06-25" },
      { id: "guardian", title: "Village Guardian", description: "Reported 3 or more issues to the Panchayat", icon: "ShieldAlert" },
      { id: "pioneer", title: "Digital Pioneer", description: "Used AI auto-tagging or live GPS coordinators", icon: "Info" }
    ]
  });

  // Fetch initial issues list on mount
  useEffect(() => {
    fetchIssues();
    
    // Load local profile defaults if they exist
    const savedProfile = localStorage.getItem("namma_ooru_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          ward: parsed.street || prev.ward
        }));
      } catch (e) {
        console.error("Error reading saved profile", e);
      }
    }
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await fetch("/api/issues");
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (e) {
      console.warn("Backend API offline, running in mock mode:", e);
    }
  };

  // SUCCESS REPORT SUBMISSION
  const handleReportSuccess = (newIssue: Issue) => {
    setIssues(prev => [newIssue, ...prev]);
    setActiveTab("issues");
    
    // Unlock vigilant badge if not unlocked
    setUserProfile(prev => {
      const updatedBadges = prev.badges.map(b => {
        if (b.id === "vigilant" && !b.unlockedAt) {
          return { ...b, unlockedAt: new Date().toISOString().split("T")[0] };
        }
        // Unlock pioneer if GPS was used
        if (b.id === "pioneer" && !b.unlockedAt && newIssue.location.includes("GPS")) {
          return { ...b, unlockedAt: new Date().toISOString().split("T")[0] };
        }
        return b;
      });

      // Unlock guardian if 3 or more issues
      const userIssuesCount = [newIssue, ...prev.badges].length; // simple increment
      const finalBadges = updatedBadges.map(b => {
        if (b.id === "guardian" && !b.unlockedAt && issues.length >= 2) {
          return { ...b, unlockedAt: new Date().toISOString().split("T")[0] };
        }
        return b;
      });

      return { ...prev, badges: finalBadges };
    });
  };

  // CITIZEN ADD COMMENT LOGIC
  const handleAddComment = async (issueId: string, text: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: userProfile.name,
          role: "citizen",
          text
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setIssues(prev => prev.map(iss => {
          if (iss.id === issueId) {
            return {
              ...iss,
              comments: [...iss.comments, newComment]
            };
          }
          return iss;
        }));

        // Simulate a smart, reassuring Panchayat response from सुरेश गौड़ा / AI assistant after 1.5 seconds
        setTimeout(async () => {
          try {
            const targetIssue = issues.find(i => i.id === issueId);
            const dept = targetIssue?.assignedDepartment || "Ground maintenance squad";
            const botResponseText = `PWD field supervisor Kittu has read your feedback: "${text}". We have scheduled workers to inspect the site and accelerate resolution. Thank you for your patience!`;

            const resBot = await fetch(`/api/issues/${issueId}/comments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                author: "Officer Suresh Gowda",
                role: "officer",
                text: botResponseText
              })
            });

            if (resBot.ok) {
              const botComment = await resBot.json();
              setIssues(p => p.map(iss => {
                if (iss.id === issueId) {
                  return {
                    ...iss,
                    comments: [...iss.comments, botComment]
                  };
                }
                return iss;
              }));
            }
          } catch (err) {
            console.error(err);
          }
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN UPDATE COMPLAINT (STATUS/DEPT/PRIORITY/NOTES)
  const handleUpdateIssue = async (id: string, updates: Partial<Issue>) => {
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedIssue = await response.json();
        setIssues(prev => prev.map(iss => iss.id === id ? updatedIssue : iss));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("namma_ooru_profile", JSON.stringify({
      name: userProfile.name,
      phone: userProfile.phone,
      street: userProfile.ward
    }));
    alert("Profile settings saved successfully!");
  };

  const t = TRANSLATIONS[language];
  const resolvedIssuesCount = issues.filter(i => i.status === "Resolved").length;

  return (
    <div className="bg-background-custom text-gray-900 min-h-screen flex flex-col font-sans pb-24">
      
      {/* Top App Bar Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-xs h-16 flex items-center justify-between px-6 border-b border-gray-100">
        {/* Logo Title */}
        <div className="flex items-center gap-2.5">
          <Landmark className="text-primary w-6 h-6 shrink-0" />
          <h1 className="font-extrabold text-sm sm:text-base text-primary tracking-tight">
            {t.appName}
          </h1>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-3">
          {/* Solved Feed Badge */}
          <button 
            onClick={() => {
              setActiveTab("issues");
              setIsAdminMode(false);
            }}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors border border-emerald-100/50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{resolvedIssuesCount + 1240} Solved</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              isAdminMode 
                ? "bg-amber-400 text-amber-950 border-amber-300 shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
            }`}
          >
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{isAdminMode ? "Citizen Mode" : "Admin Panel"}</span>
            <span className="md:hidden">{isAdminMode ? "Citizen" : "Admin"}</span>
          </button>

          {/* Languages Selector */}
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 pt-20 px-4 max-w-5xl mx-auto w-full">
        {isAdminMode ? (
          /* Render Panchayat Officer Panel */
          <AdminPortal 
            issues={issues} 
            onUpdateIssue={handleUpdateIssue} 
            language={language} 
          />
        ) : (
          /* Render Citizen Frontends */
          <div className="space-y-4">
            
            {/* Live Ticker Solved Banner */}
            <StatsBanner language={language} resolvedCount={resolvedIssuesCount} />

            <AnimatePresence mode="wait">
              {activeTab === "home" && (
                <motion.div
                  key="home-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 pb-10"
                >
                  {/* Hero Jumbotron Section */}
                  <section className="hero-gradient px-6 py-12 rounded-3xl text-center flex flex-col items-center border border-gray-100 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-1/2 left-5 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-1/3 right-5 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/5 rounded-full mb-5">
                      <Megaphone className="text-primary w-4 h-4 animate-bounce shrink-0" />
                      <span className="text-primary font-bold text-xs">{t.yourStreetYourVoice}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight max-w-md leading-tight mb-3">
                      {t.taglineTitle} <span className="text-amber-500">{t.taglineHighlight}</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-lg leading-relaxed mb-8">
                      {t.taglineDesc}
                    </p>

                    <div className="flex flex-col sm:flex-row w-full gap-3.5 max-w-sm justify-center">
                      <button 
                        onClick={() => {
                          setPreselectedCategory(undefined);
                          setIsReportModalOpen(true);
                        }}
                        className="bg-primary text-white h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-transform shadow-md hover:bg-primary-light"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.reportProblemBtn}</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          const worksSection = document.getElementById("how-it-works");
                          worksSection?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-white text-primary border border-gray-200 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-xs active:scale-95 transition-transform shadow-xs hover:bg-gray-50"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>{t.howItWorksBtn}</span>
                      </button>
                    </div>
                  </section>

                  {/* AI Panchayat Virtual Assistant Section */}
                  <section>
                    <AiAssistant language={language} />
                  </section>

                  {/* Common Problems Category Grid */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <Info className="w-5 h-5 text-primary shrink-0" />
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
                        {t.commonProblemsTitle}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {PROBLEM_CATEGORIES.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setPreselectedCategory(cat.name);
                            setIsReportModalOpen(true);
                          }}
                          className="bg-white rounded-2xl overflow-hidden custom-shadow border border-gray-100/80 group active:scale-98 cursor-pointer hover:border-primary/30 transition-all flex flex-col justify-between"
                        >
                          <div className="h-28 w-full overflow-hidden bg-gray-50 relative">
                            <img 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              src={cat.image} 
                              alt={cat.name}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-lg">
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1">TAP TO CHOOSE</span>
                            </div>
                          </div>
                          <div className="p-3 bg-white">
                            <p className="font-bold text-[11px] text-gray-800 text-center leading-tight">
                              {cat.name.split(" (")[0]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* How It Works Tonal Steps */}
                  <section id="how-it-works" className="bg-white rounded-3xl border border-gray-100 p-8 space-y-8 scroll-mt-20">
                    <div className="text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <h3 className="font-extrabold text-sm sm:text-base text-primary tracking-tight">
                          {t.howItWorksTitle}
                        </h3>
                      </div>
                      <p className="text-[9px] font-extrabold text-gray-400 tracking-widest uppercase">
                        {t.howItWorksSubtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      {/* Step 1 */}
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-400/5 rounded-full group-hover:scale-110 transition-transform" />
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-sm shrink-0">
                            1
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-primary mb-1">{t.step1Title}</h4>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{t.step1Desc}</p>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute -right-3 -top-3 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-110 transition-transform" />
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-extrabold text-sm shrink-0">
                            2
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-primary mb-1">{t.step2Title}</h4>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{t.step2Desc}</p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute -right-3 -top-3 w-16 h-16 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform" />
                        <div className="flex items-start gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                            3
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-primary mb-1">{t.step3Title}</h4>
                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{t.step3Desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button 
                        onClick={() => {
                          setPreselectedCategory(undefined);
                          setIsReportModalOpen(true);
                        }}
                        className="bg-primary text-white px-8 py-3.5 rounded-xl flex items-center gap-2 font-bold text-xs active:scale-95 transition-transform shadow-md hover:bg-primary-light"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.reportProblemNowBtn}</span>
                      </button>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === "issues" && (
                <motion.div
                  key="issues-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pb-10"
                >
                  <MyIssuesList 
                    issues={issues} 
                    onAddComment={handleAddComment} 
                    language={language} 
                  />
                </motion.div>
              )}

              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pb-10 max-w-2xl mx-auto space-y-6"
                >
                  {/* Avatar Profile Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-black text-xl flex items-center justify-center shrink-0 shadow-inner">
                      {userProfile.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="text-center sm:text-left space-y-1 flex-1">
                      <h4 className="font-extrabold text-base text-gray-900 leading-tight">{userProfile.name}</h4>
                      <p className="text-xs text-gray-500 font-bold flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{userProfile.ward}, {userProfile.village}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold">Citizen Phone: {userProfile.phone}</p>
                    </div>
                    
                    {/* Achievement score stats */}
                    <div className="bg-primary/5 px-4 py-3 rounded-2xl border border-primary/10 text-center shrink-0 min-w-[100px]">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Reports filed</p>
                      <p className="text-xl font-extrabold text-primary mt-1">{issues.length}</p>
                    </div>
                  </div>

                  {/* Badges Achievements */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                    <h5 className="font-bold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Citizen Achievement Badges</span>
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {userProfile.badges.map((badge) => (
                        <div 
                          key={badge.id}
                          className={`p-4 rounded-2xl border flex flex-col justify-between text-center gap-2 transition-all ${
                            badge.unlockedAt 
                              ? "bg-amber-50/20 border-amber-200/60 shadow-xs" 
                              : "bg-gray-50/30 border-gray-100 opacity-60"
                          }`}
                        >
                          <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-xs border border-gray-100">
                            <Award className={`w-5 h-5 ${badge.unlockedAt ? "text-amber-500" : "text-gray-300"}`} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{badge.title}</p>
                            <p className="text-[10px] text-gray-500 leading-normal font-medium mt-1">{badge.description}</p>
                          </div>
                          {badge.unlockedAt ? (
                            <span className="text-[9px] bg-emerald-500 text-white py-0.5 px-2 rounded-full font-bold self-center">
                              Unlocked {badge.unlockedAt}
                            </span>
                          ) : (
                            <span className="text-[9px] bg-gray-200 text-gray-500 py-0.5 px-2 rounded-full font-bold self-center">
                              Locked
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Settings Editor Form */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6">
                    <h5 className="font-bold text-xs text-gray-900 uppercase tracking-wider mb-4">Edit Profile Settings</h5>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase">Your Name</label>
                          <input 
                            type="text" 
                            value={userProfile.name}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase">Mobile Phone</label>
                          <input 
                            type="tel" 
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold text-gray-800"
                          />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-extrabold text-gray-400 uppercase">Street Name / Ward</label>
                          <select
                            value={userProfile.ward}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, ward: e.target.value }))}
                            className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-gray-700"
                          >
                            {VILLAGE_STREETS.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="bg-primary text-white hover:bg-primary-light font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        Save Settings
                      </button>
                    </form>
                  </div>

                  {/* Important Village emergency directory numbers */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                    <h5 className="font-bold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>Village Panchayat Emergency Hotlines</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
                      <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase leading-none mb-1">Panchayat Office</p>
                          <p className="font-bold text-gray-800">080-23456789</p>
                        </div>
                        <span className="text-xs text-primary font-bold">Call</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase leading-none mb-1">BESCOM Fuse Desk</p>
                          <p className="font-bold text-gray-800">1912</p>
                        </div>
                        <span className="text-xs text-primary font-bold">Call</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase leading-none mb-1">Water Supply Operator</p>
                          <p className="font-bold text-gray-800">9448011223</p>
                        </div>
                        <span className="text-xs text-primary font-bold">Call</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-gray-400 font-extrabold uppercase leading-none mb-1">Village Health Inspector</p>
                          <p className="font-bold text-gray-800">9845099887</p>
                        </div>
                        <span className="text-xs text-primary font-bold">Call</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer Branding section */}
      <footer className="bg-primary text-white py-12 px-6 text-center shrink-0 mt-10">
        <h4 className="font-extrabold text-sm sm:text-base mb-1.5">Namma Ooru My Village</h4>
        <p className="text-xs opacity-75 mb-5">Built for our community · My Village</p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs opacity-70 mb-6">
          <span>© 2026 · Namma Ooru</span>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          <button 
            onClick={() => setIsAdminMode(true)}
            className="underline hover:text-white"
          >
            {t.adminPortal}
          </button>
        </div>
        <p className="text-[10px] opacity-50 leading-loose">
          Developed by <a className="underline hover:text-white" href="https://queenbug.com/">Queenbug Technologies</a>
        </p>
      </footer>

      {/* Responsive Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-4 pb-safe bg-white z-50 rounded-t-3xl shadow-[0_-4px_12px_rgba(30,58,138,0.06)] border-t border-gray-100">
        <button 
          onClick={() => {
            setActiveTab("home");
            setIsAdminMode(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 duration-200 ${
            activeTab === "home" && !isAdminMode ? "text-primary font-bold" : "text-gray-400 font-medium"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "home" && !isAdminMode ? "fill-primary" : ""}`} />
          <span className="text-[10px]">{t.homeNav}</span>
          {activeTab === "home" && !isAdminMode && <div className="w-1 h-1 bg-primary rounded-full" />}
        </button>

        <button 
          onClick={() => {
            setActiveTab("issues");
            setIsAdminMode(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 duration-200 ${
            activeTab === "issues" && !isAdminMode ? "text-primary font-bold" : "text-gray-400 font-medium"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">{t.myIssuesNav}</span>
          {activeTab === "issues" && !isAdminMode && <div className="w-1 h-1 bg-primary rounded-full" />}
        </button>

        <button 
          onClick={() => {
            setActiveTab("profile");
            setIsAdminMode(false);
          }}
          className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 duration-200 ${
            activeTab === "profile" && !isAdminMode ? "text-primary font-bold" : "text-gray-400 font-medium"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{t.profileNav}</span>
          {activeTab === "profile" && !isAdminMode && <div className="w-1 h-1 bg-primary rounded-full" />}
        </button>
      </nav>

      {/* Slide-over Multi-step Report Complaint Wizard Modal */}
      <AnimatePresence>
        {isReportModalOpen && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={() => {
              setIsReportModalOpen(false);
              setPreselectedCategory(undefined);
            }}
            language={language}
            onSuccess={handleReportSuccess}
            preselectedCategory={preselectedCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
