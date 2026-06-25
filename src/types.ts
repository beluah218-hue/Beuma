export interface Comment {
  id: string;
  author: string;
  role: "citizen" | "officer" | "ai";
  text: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  category: string;
  description: string;
  location: string;
  status: "Submitted" | "In Progress" | "Resolved";
  reporterName: string;
  reporterPhone: string;
  date: string;
  voiceNoteUrl?: string; // Base64 data URL
  photoUrl?: string; // Image link or Base64 data URL
  assignedDepartment?: string;
  officialNotes?: string;
  comments: Comment[];
  priority?: "Low" | "Medium" | "High";
}

export interface UserProfile {
  name: string;
  phone: string;
  village: string;
  ward: string;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }>;
}

export type Language = "en" | "ta";

export interface TranslationDictionary {
  appName: string;
  yourStreetYourVoice: string;
  taglineTitle: string;
  taglineHighlight: string;
  taglineDesc: string;
  reportProblemBtn: string;
  howItWorksBtn: string;
  commonProblemsTitle: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  reportProblemNowBtn: string;
  adminPortal: string;
  solvedBadge: string;
  homeNav: string;
  myIssuesNav: string;
  profileNav: string;
  logoutBtn: string;
  adminDashboardTitle: string;
  totalIssues: string;
  resolvedIssues: string;
  pendingIssues: string;
  resolutionRate: string;
}
