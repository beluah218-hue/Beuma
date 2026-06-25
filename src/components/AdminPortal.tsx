import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building, CheckCircle2, AlertCircle, RefreshCw, Sparkles, 
  Trash2, User, Phone, MapPin, Calendar, ClipboardList, Send, CheckSquare
} from "lucide-react";
import { Issue, Language } from "../types";
import { TRANSLATIONS } from "../data";

interface AdminPortalProps {
  issues: Issue[];
  onUpdateIssue: (id: string, updates: Partial<Issue>) => void;
  language: Language;
}

export default function AdminPortal({
  issues,
  onUpdateIssue,
  language
}: AdminPortalProps) {
  const t = TRANSLATIONS[language];
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [officialNotes, setOfficialNotes] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);

  // Compute stats
  const totalCount = issues.length;
  const resolvedCount = issues.filter(i => i.status === "Resolved").length;
  const pendingCount = issues.filter(i => i.status === "Submitted").length;
  const inProgressCount = issues.filter(i => i.status === "In Progress").length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  // Departments list
  const departments = [
    "Public Works Department (PWD)",
    "Electricity Board (BESCOM)",
    "Water Supply and Sanitation Board",
    "Solid Waste Management Cell",
    "Health and Veterinary Cell",
    "Local Panchayat Administration"
  ];

  // AI draft response function
  const handleAiDraftResponse = async () => {
    if (!selectedIssue) return;
    setIsDrafting(true);
    try {
      const response = await fetch("/api/ai/draft-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedIssue.category,
          description: selectedIssue.description,
          location: selectedIssue.location
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.draftText) {
          setOfficialNotes(data.draftText);
        }
      }
    } catch (error) {
      console.error("AI response draft failed:", error);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleSaveNotes = () => {
    if (!selectedIssueId) return;
    onUpdateIssue(selectedIssueId, { officialNotes });
    alert("Official resolution notes updated successfully!");
  };

  // Compute category chart
  const categoryCounts: Record<string, number> = {};
  issues.forEach(i => {
    const key = i.category.split(" (")[0];
    categoryCounts[key] = (categoryCounts[key] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 leading-none">
              {t.adminDashboardTitle}
            </h3>
            <p className="text-[11px] text-gray-500 font-bold mt-1.5 flex items-center gap-1.5">
              <span>Commissioner Officer: Suresh Gowda</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 font-bold">Active Station</span>
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-900 px-3 py-1.5 rounded-full font-bold self-start">
          Role: Village Panchayat Commissioner
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Stats */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.totalIssues}</p>
          <p className="text-xl font-extrabold text-gray-900 mt-1">{totalCount}</p>
        </div>
        {/* Resolved Stats */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.resolvedIssues}</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
            <span>{resolvedCount}</span>
            <CheckCircle2 className="w-4 h-4" />
          </p>
        </div>
        {/* Pending Stats */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.pendingIssues}</p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">{pendingCount + inProgressCount}</p>
        </div>
        {/* Resolution Rate */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.resolutionRate}</p>
          <p className="text-xl font-extrabold text-primary mt-1">{resolutionRate}%</p>
        </div>
      </div>

      {/* Split layout: Category Charts + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Analytics + List Board */}
        <div className="lg:col-span-7 space-y-6">
          {/* List Board of all reported complaints */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4">
            <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span>Complaints Intake Registry</span>
            </h4>

            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
              {issues.map((iss) => (
                <div
                  key={iss.id}
                  onClick={() => {
                    setSelectedIssueId(iss.id);
                    setOfficialNotes(iss.officialNotes || "");
                  }}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedIssueId === iss.id
                      ? "border-primary bg-primary/[0.01] shadow-xs"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[11px] font-extrabold text-gray-900 leading-tight">
                      {iss.category.split(" (")[0]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                      iss.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      iss.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-100" :
                      "bg-blue-50 text-blue-700 border-blue-100"
                    }`}>
                      {iss.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                    {iss.description}
                  </p>
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {iss.location.split(" (")[0]}</span>
                    <span>{iss.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simple category bento charts bar */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4">
            <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
              Complaints Category Distribution
            </h4>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / totalCount) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-gray-700">
                      <span>{cat}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Administration Actions & Officer Panel */}
        <div className="lg:col-span-5">
          {selectedIssue ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-6">
              <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pb-3 border-b border-gray-100">
                <CheckSquare className="w-4 h-4 text-primary" />
                <span>Officer Dispatch Console</span>
              </h4>

              {/* Status Update Trigger buttons */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Workflow Status</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Submitted", "In Progress", "Resolved"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateIssue(selectedIssue.id, { status: st })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedIssue.status === st
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Select dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Urgency Priority</label>
                <select
                  value={selectedIssue.priority || "Medium"}
                  onChange={(e) => onUpdateIssue(selectedIssue.id, { priority: e.target.value as any })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-gray-700"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              {/* Department Selector dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Department</label>
                <select
                  value={selectedIssue.assignedDepartment || "Local Panchayat Administration"}
                  onChange={(e) => onUpdateIssue(selectedIssue.id, { assignedDepartment: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-gray-700"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Official notes & AI template generation */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Resolution Report Notes</label>
                  
                  {/* AI response drafting helper */}
                  <button
                    type="button"
                    onClick={handleAiDraftResponse}
                    disabled={isDrafting}
                    className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg text-[10px] font-bold disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span>{isDrafting ? "AI Drafting..." : "AI Draft Note"}</span>
                  </button>
                </div>

                <textarea
                  value={officialNotes}
                  onChange={(e) => setOfficialNotes(e.target.value)}
                  placeholder="Draft resolution description... (e.g., Electrician Kittu replaced the bulb. Switched on on 2026-06-22.)"
                  className="w-full h-24 p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium text-gray-800"
                />

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Publish Update & Notify Citizen</span>
                </button>
              </div>

              {/* Review metadata details of target reported complaint */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 text-[10px] font-semibold text-gray-500">
                <p className="font-extrabold text-gray-700 text-xs uppercase mb-1">Target Citizen Report</p>
                <p><strong className="text-gray-700">Reporter:</strong> {selectedIssue.reporterName} (<span className="text-primary font-bold">{selectedIssue.reporterPhone}</span>)</p>
                <p><strong className="text-gray-700">Coordinates:</strong> {selectedIssue.location}</p>
                <p className="line-clamp-2"><strong className="text-gray-700">Raw report:</strong> {selectedIssue.description}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center h-[50vh] flex flex-col items-center justify-center space-y-3">
              <ClipboardList className="w-10 h-10 text-gray-200" />
              <div>
                <p className="font-bold text-sm text-gray-700">Select complaint registry</p>
                <p className="text-xs text-gray-400 mt-1">Intake, assign departments, and generate Gemini-powered citizen reports immediately.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
