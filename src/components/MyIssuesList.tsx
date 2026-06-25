import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Filter, MapPin, Clock, User, Phone, CheckCircle, 
  MessageSquare, Send, ChevronRight, Play, Volume2, Calendar, ShieldCheck,
  AlertCircle, ArrowUpRight
} from "lucide-react";
import { Issue, Comment, Language } from "../types";
import { TRANSLATIONS } from "../data";

interface MyIssuesListProps {
  issues: Issue[];
  onAddComment: (issueId: string, text: string) => void;
  language: Language;
}

export default function MyIssuesList({
  issues,
  onAddComment,
  language
}: MyIssuesListProps) {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const filteredIssues = issues.filter((iss) => {
    const matchesSearch = 
      iss.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || iss.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const selectedIssue = issues.find(iss => iss.id === selectedIssueId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Progress": return "bg-amber-50 text-amber-800 border-amber-100";
      case "Resolved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-50 text-rose-700 border-rose-100 font-bold";
      case "Medium": return "bg-amber-50 text-amber-800 border-amber-100";
      case "Low": return "bg-blue-50 text-blue-800 border-blue-100";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedIssueId) return;
    onAddComment(selectedIssueId, commentText);
    setCommentText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[60vh]">
      {/* Issues Directory Panel */}
      <div className={`space-y-4 lg:col-span-5 ${selectedIssueId ? "hidden lg:block" : "block"}`}>
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["All", "Submitted", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((iss) => (
              <div
                key={iss.id}
                onClick={() => setSelectedIssueId(iss.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  selectedIssueId === iss.id
                    ? "border-primary bg-primary/[0.02] shadow-xs"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusColor(iss.status)}`}>
                    {iss.status}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {iss.date}
                  </span>
                </div>

                <h5 className="font-bold text-xs text-gray-900 leading-snug mb-1 truncate">
                  {iss.category}
                </h5>
                <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-3">
                  {iss.description}
                </p>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 overflow-hidden">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate max-w-[150px]">{iss.location.split(" (")[0]}</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 shrink-0 group">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-400">No issues matching search found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Issue Details Panel */}
      <div className={`lg:col-span-7 ${selectedIssueId ? "block" : "hidden lg:block"}`}>
        {selectedIssue ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 max-h-[70vh] overflow-y-auto"
          >
            {/* Header / Back to list */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <button
                onClick={() => setSelectedIssueId(null)}
                className="lg:hidden flex items-center gap-1 text-xs font-bold text-gray-600"
              >
                <span>← Back to list</span>
              </button>
              <div className="flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(selectedIssue.status)}`}>
                  {selectedIssue.status}
                </span>
                {selectedIssue.priority && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(selectedIssue.priority)}`}>
                    Priority: {selectedIssue.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Core Details */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                {selectedIssue.category}
              </h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                {selectedIssue.description}
              </p>

              {/* Photo Display */}
              {selectedIssue.photoUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 h-48 bg-gray-50">
                  <img 
                    src={selectedIssue.photoUrl} 
                    className="w-full h-full object-cover" 
                    alt="Citizen uploaded proof"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Voice Note Player */}
              {selectedIssue.voiceNoteUrl && (
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">Citizen Voice Note Attachment</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Play back user reported voice recording</p>
                  </div>
                  <audio controls src={selectedIssue.voiceNoteUrl} className="max-w-[150px] scale-90" />
                </div>
              )}
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-600 bg-gray-50 p-4 rounded-2xl">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> <span className="text-gray-900 font-bold">{selectedIssue.location.split(" (")[0]}</span></p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> <span>Reported: {selectedIssue.date}</span></p>
              <p className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> <span>Reporter: {selectedIssue.reporterName}</span></p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span>Contact: {selectedIssue.reporterPhone}</span></p>
              {selectedIssue.assignedDepartment && (
                <p className="col-span-1 sm:col-span-2 flex items-center gap-2 bg-indigo-50/50 p-2 rounded-lg text-indigo-900 font-semibold border border-indigo-100/50">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Assigned Dept: {selectedIssue.assignedDepartment}</span>
                </p>
              )}
            </div>

            {/* Officer Resolution Notes */}
            {selectedIssue.officialNotes && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-1">
                <p className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Official Resolution Update
                </p>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {selectedIssue.officialNotes}
                </p>
              </div>
            )}

            {/* Chat Board / Discussion History */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h5 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>Citizen-Municipal Resolution Board</span>
              </h5>

              {/* Chat Timeline list */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {selectedIssue.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      comment.role === "officer"
                        ? "bg-amber-50 text-amber-900 border border-amber-100 mr-auto"
                        : comment.role === "ai"
                        ? "bg-indigo-50 text-indigo-950 border border-indigo-100 mr-auto"
                        : "bg-gray-100 text-gray-800 ml-auto"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 gap-4">
                      <span className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">
                        {comment.author} ({comment.role})
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-medium">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Message Input form */}
              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask for an update or send comment..."
                  className="flex-1 px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary-light transition-all shadow-xs disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center h-[55vh] flex flex-col items-center justify-center space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-200" />
            <div>
              <p className="font-bold text-sm text-gray-700">Select an issue on the left</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">View full timeline, pictures, and discuss the ticket progress with the local team.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
