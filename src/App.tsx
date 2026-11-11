import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  Shield,
  CheckCircle2,
  UserCheck,
  Sparkles,
  X,
  Send,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  DollarSign,
  BarChart3,
  CheckSquare,
  Building2,
  MapPin,
  Clock,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Info,
} from "lucide-react";

// ============================================================================
// DATATYPES & DATABRICKS MOCK DATA BINDINGS
// ============================================================================

export type PersonaId = "AD" | "RG" | "CM" | "RV" | "MK" | "ST";

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  badgeBg: string;
  badgeText: string;
  accessDesc: string;
  allowedTabs: TabId[];
}

export type TabId =
  | "overview"
  | "funnel"
  | "yield"
  | "revenue"
  | "programs"
  | "counselor"
  | "reviewer"
  | "market"
  | "executive";

export interface KPIItem {
  label: string;
  value: string;
  delta: string;
  deltaType: "emerald" | "rose" | "amber" | "neutral";
  subtext?: string;
}

// bind: admissions_lifecycle.analytics.vw_admissions_funnel
export interface FunnelVarianceItem {
  stage: string;
  actual: number;
  target: number;
  variance: number;
  pct: number;
  targetPct: number;
}

export const MOCK_FUNNEL_VARIANCE: FunnelVarianceItem[] = [
  {
    stage: "Applications Submitted",
    actual: 15000,
    target: 15000,
    variance: 0,
    pct: 100,
    targetPct: 100,
  },
  {
    stage: "Application Fee Paid",
    actual: 13796,
    target: 13500,
    variance: 296,
    pct: 92.0,
    targetPct: 90.0,
  },
  {
    stage: "Eligible Applications",
    actual: 9500,
    target: 9500,
    variance: 0,
    pct: 63.3,
    targetPct: 63.3,
  },
  {
    stage: "Shortlisted Candidates",
    actual: 7500,
    target: 7500,
    variance: 0,
    pct: 50.0,
    targetPct: 50.0,
  },
  {
    stage: "Seat Allocated",
    actual: 4500,
    target: 4500,
    variance: 0,
    pct: 30.0,
    targetPct: 30.0,
  },
  {
    stage: "Final Enrolled",
    actual: 3000,
    target: 3000,
    variance: 0,
    pct: 20.0,
    targetPct: 20.0,
  },
];

// bind: admissions_lifecycle.analytics.vw_stage_dropoff
export interface StageDropoffItem {
  stage: string;
  count: number;
  conversion: number; // percentage from previous stage
}

export const MOCK_STAGE_DROPOFF: StageDropoffItem[] = [
  { stage: "Submitted", count: 15000, conversion: 100 },
  { stage: "Application Fee Paid", count: 13500, conversion: 90.0 },
  { stage: "Entrance Score Submitted", count: 12500, conversion: 92.6 },
  { stage: "Eligible", count: 9500, conversion: 76.0 },
  { stage: "Shortlisted", count: 7500, conversion: 78.9 },
  { stage: "Seat Allocated", count: 4500, conversion: 60.0 },
  { stage: "Seat Accepted", count: 3600, conversion: 80.0 },
  { stage: "Admission Fee Paid", count: 3200, conversion: 88.9 },
  { stage: "Enrollment Confirmed", count: 3000, conversion: 93.8 },
];

// bind: admissions_lifecycle.analytics.application_status_history
export const MOCK_STAGE_VELOCITY = [
  { stage: "Submitted", days: 2.1 },
  { stage: "Application Fee Paid", days: 1.4 },
  { stage: "Entrance Score", days: 3.6 },
  { stage: "Eligible", days: 4.2 },
  { stage: "Shortlisted", days: 5.1 },
  { stage: "Seat Allocated", days: 6.3 },
  { stage: "Seat Accepted", days: 7.2 },
  { stage: "Admission Fee", days: 3.8 },
  { stage: "Enrollment Confirmed", days: 1.9 },
];

// bind: admissions_lifecycle.analytics.vw_monthly_trend
export interface MonthlyTrendItem {
  month: string;
  apps: number;
  enrollments: number;
}

export const MOCK_MONTHLY_TREND: MonthlyTrendItem[] = [
  { month: "2026-10", apps: 1068, enrollments: 212 },
  { month: "2026-11", apps: 978, enrollments: 177 },
  { month: "2026-12", apps: 1000, enrollments: 199 },
  { month: "2027-01", apps: 1025, enrollments: 202 },
  { month: "2027-02", apps: 940, enrollments: 201 },
  { month: "2027-03", apps: 1033, enrollments: 203 },
  { month: "2027-04", apps: 1013, enrollments: 210 },
  { month: "2027-05", apps: 1051, enrollments: 229 },
  { month: "2027-06", apps: 937, enrollments: 173 },
  { month: "2027-07", apps: 1040, enrollments: 208 },
  { month: "2027-08", apps: 1012, enrollments: 204 },
  { month: "2027-09", apps: 1038, enrollments: 217 },
  { month: "2027-10", apps: 1040, enrollments: 205 },
  { month: "2027-11", apps: 1016, enrollments: 196 },
  { month: "2027-12", apps: 809, enrollments: 164 },
];

// bind: admissions_lifecycle.analytics.vw_intake_trend
export const MOCK_INTAKE_TREND = [
  {
    intake: "July 2027 Intake",
    apps: 11968,
    enrolled: 2373,
    yield: 19.83,
    color: "bg-indigo-600",
  },
  {
    intake: "January 2027 Intake",
    apps: 1497,
    enrolled: 294,
    yield: 19.64,
    color: "bg-blue-500",
  },
  {
    intake: "January 2028 Intake",
    apps: 1535,
    enrolled: 333,
    yield: 21.69,
    color: "bg-slate-500",
  },
];

// bind: admissions_lifecycle.analytics.vw_specialization_capacity_utilization
export interface SpecializationCapacity {
  name: string;
  allocated: number;
  capacity: number;
  pct: number;
  status: "Oversubscribed" | "Filling" | "Open";
}

export const MOCK_CAPACITY_UTILIZATION: SpecializationCapacity[] = [
  {
    name: "Finance",
    allocated: 241,
    capacity: 120,
    pct: 200.8,
    status: "Oversubscribed",
  },
  {
    name: "Marketing",
    allocated: 239,
    capacity: 120,
    pct: 199.2,
    status: "Oversubscribed",
  },
  {
    name: "Cloud Computing",
    allocated: 144,
    capacity: 120,
    pct: 120.0,
    status: "Oversubscribed",
  },
  {
    name: "Applied Physics",
    allocated: 136,
    capacity: 120,
    pct: 113.3,
    status: "Oversubscribed",
  },
  {
    name: "Manufacturing",
    allocated: 135,
    capacity: 120,
    pct: 112.5,
    status: "Oversubscribed",
  },
  {
    name: "Artificial Intelligence",
    allocated: 132,
    capacity: 120,
    pct: 110.0,
    status: "Oversubscribed",
  },
  {
    name: "Genetics",
    allocated: 132,
    capacity: 120,
    pct: 110.0,
    status: "Oversubscribed",
  },
  {
    name: "Dental Surgery",
    allocated: 129,
    capacity: 120,
    pct: 107.5,
    status: "Oversubscribed",
  },
  {
    name: "Electronics & Comm.",
    allocated: 108,
    capacity: 120,
    pct: 90.0,
    status: "Filling",
  },
  {
    name: "Cyber Security",
    allocated: 96,
    capacity: 120,
    pct: 80.0,
    status: "Open",
  },
];

// bind: admissions_lifecycle.analytics.vw_revenue_waterfall
export const MOCK_REVENUE_WATERFALL = [
  { stage: "Beginning Balance", amount: 0, display: "₹0M", type: "base" },
  { stage: "Application Fees", amount: 13.8, display: "+₹13.8M", type: "add" },
  { stage: "Admission Fees", amount: 160.0, display: "+₹160M", type: "add" },
  { stage: "Ending Revenue", amount: 173.8, display: "₹175M", type: "total" },
];

// bind: admissions_lifecycle.analytics.vw_state_wise_applications
export const MOCK_STATE_WISE = [
  { state: "Karnataka", count: 3960, pct: 26.4, color: "bg-indigo-600" },
  { state: "Tamil Nadu", count: 1453, pct: 9.7, color: "bg-blue-500" },
  { state: "Telangana", count: 1079, pct: 7.2, color: "bg-slate-500" },
  { state: "Others", count: 1028, pct: 6.9, color: "bg-slate-400" },
  { state: "Kerala", count: 1005, pct: 6.7, color: "bg-slate-400" },
  { state: "Andhra Pradesh", count: 770, pct: 5.1, color: "bg-slate-400" },
];

// bind: admissions_lifecycle.analytics.vw_counselor_performance
export interface CounselorItem {
  name: string;
  apps: number;
  enrolled: number;
  conversion: number;
  isTop: boolean;
}

export const MOCK_COUNSELOR_LEADERBOARD: CounselorItem[] = [
  {
    name: "Dhruv Ahluwalia",
    apps: 244,
    enrolled: 49,
    conversion: 20.1,
    isTop: true,
  },
  {
    name: "Darika Murthy",
    apps: 239,
    enrolled: 43,
    conversion: 18.0,
    isTop: true,
  },
  {
    name: "Chatresh Rajan",
    apps: 236,
    enrolled: 39,
    conversion: 16.5,
    isTop: true,
  },
  {
    name: "Gagan Sane",
    apps: 234,
    enrolled: 49,
    conversion: 21.0,
    isTop: false,
  },
  { name: "Sai Raj", apps: 233, enrolled: 51, conversion: 21.9, isTop: false },
  {
    name: "Yahvi Venkataraman",
    apps: 233,
    enrolled: 54,
    conversion: 23.2,
    isTop: false,
  },
];

// bind: admissions_lifecycle.analytics.vw_reviewer_productivity
export const MOCK_REVIEWER_PRODUCTIVITY = [
  { id: "REV0019", reviews: 307 },
  { id: "REV0002", reviews: 298 },
  { id: "REV0013", reviews: 296 },
  { id: "REV0028", reviews: 295 },
  { id: "REV0016", reviews: 293 },
  { id: "REV0008", reviews: 291 },
];

// bind: admissions_lifecycle.analytics.document_verification
export const MOCK_VERIFICATION_AUDIT = [
  { campus: "Bengaluru", verified: 28400, pending: 38, pct: 99.9 },
  { campus: "Mysuru", verified: 28300, pending: 42, pct: 99.9 },
  { campus: "Mangalore", verified: 28450, pending: 31, pct: 99.9 },
  { campus: "Chennai", verified: 28402, pending: 31, pct: 99.9 },
];

// bind: admissions_lifecycle.analytics.vw_program_demand
export const MOCK_PROGRAM_DEMAND = [
  { name: "B.Tech Computer Science", apps: 3422, pct: 22.8 },
  { name: "MBA General", apps: 2602, pct: 17.3 },
  { name: "B.Tech Artificial Intelligence", apps: 1716, pct: 11.4 },
  { name: "BBA Digital Business", apps: 1528, pct: 10.2 },
  { name: "MBBS Medicine", apps: 1245, pct: 8.3 },
  { name: "B.Tech ECE", apps: 617, pct: 4.1 },
];

// bind: admissions_lifecycle.analytics.vw_applicant_360
export interface Applicant360 {
  id: string;
  name: string;
  program: string;
  specialization: string;
  status: "In Review" | "Shortlisted" | "Seat Allocated" | "Enrolled";
  counselor: string;
  feePaid: "Yes" | "No";
  amount: string;
  enrolled: "Yes" | "No";
}

export const MOCK_APPLICANTS_360: Applicant360[] = [
  {
    id: "APP-10291",
    name: "Aarav Sharma",
    program: "B.Tech CS",
    specialization: "Artificial Intelligence",
    status: "Enrolled",
    counselor: "Sai Raj",
    feePaid: "Yes",
    amount: "₹550,000",
    enrolled: "Yes",
  },
  {
    id: "APP-10292",
    name: "Diya Patel",
    program: "MBA",
    specialization: "Finance",
    status: "Seat Allocated",
    counselor: "Dhruv Ahluwalia",
    feePaid: "Yes",
    amount: "₹50,000",
    enrolled: "No",
  },
  {
    id: "APP-10293",
    name: "Rohan Verma",
    program: "B.Tech CS",
    specialization: "Cloud Computing",
    status: "In Review",
    counselor: "Gagan Sane",
    feePaid: "Yes",
    amount: "₹50,000",
    enrolled: "No",
  },
  {
    id: "APP-10294",
    name: "Ananya Rao",
    program: "BBA",
    specialization: "Marketing",
    status: "Shortlisted",
    counselor: "Darika Murthy",
    feePaid: "Yes",
    amount: "₹50,000",
    enrolled: "No",
  },
  {
    id: "APP-10295",
    name: "Vikram Sengupta",
    program: "MBBS",
    specialization: "General Medicine",
    status: "Enrolled",
    counselor: "Yahvi Venkataraman",
    feePaid: "Yes",
    amount: "₹550,000",
    enrolled: "Yes",
  },
  {
    id: "APP-10296",
    name: "Sneha Kulkarni",
    program: "B.Tech ECE",
    specialization: "Robotics",
    status: "Seat Allocated",
    counselor: "Chatresh Rajan",
    feePaid: "Yes",
    amount: "₹50,000",
    enrolled: "No",
  },
  {
    id: "APP-10297",
    name: "Kabir Mehta",
    program: "MBA",
    specialization: "Analytics",
    status: "In Review",
    counselor: "Sai Raj",
    feePaid: "Yes",
    amount: "₹50,000",
    enrolled: "No",
  },
  {
    id: "APP-10298",
    name: "Ishita Nair",
    program: "B.Tech CS",
    specialization: "Cyber Security",
    status: "Enrolled",
    counselor: "Dhruv Ahluwalia",
    feePaid: "Yes",
    amount: "₹550,000",
    enrolled: "Yes",
  },
];

// ============================================================================
// PERSONAS DEFINITIONS
// ============================================================================

export const PERSONAS: Persona[] = [
  {
    id: "AD",
    name: "Admissions Director",
    role: "Full Access Executive",
    badgeBg: "bg-indigo-600",
    badgeText: "text-white",
    accessDesc: "Full access to all metrics, strategy & financial views",
    allowedTabs: [
      "overview",
      "funnel",
      "yield",
      "revenue",
      "programs",
      "counselor",
      "reviewer",
      "market",
      "executive",
    ],
  },
  {
    id: "RG",
    name: "Registrar",
    role: "Operations & Revenue",
    badgeBg: "bg-blue-600",
    badgeText: "text-white",
    accessDesc: "All operational & revenue metrics; no counselor details",
    allowedTabs: [
      "overview",
      "funnel",
      "yield",
      "revenue",
      "programs",
      "reviewer",
      "market",
      "executive",
    ],
  },
  {
    id: "CM",
    name: "Counselor Manager",
    role: "Funnel & Team Lead",
    badgeBg: "bg-violet-600",
    badgeText: "text-white",
    accessDesc: "Funnel, programs, counselor team insights; no revenue",
    allowedTabs: ["overview", "funnel", "programs", "counselor"],
  },
  {
    id: "RV",
    name: "Reviewer",
    role: "Document Verification",
    badgeBg: "bg-amber-600",
    badgeText: "text-white",
    accessDesc: "Review & document verification operations only",
    allowedTabs: ["overview", "yield", "programs", "reviewer", "executive"],
  },
  {
    id: "MK",
    name: "Marketing Analyst",
    role: "Growth & Demographics",
    badgeBg: "bg-emerald-600",
    badgeText: "text-white",
    accessDesc:
      "Funnel, programs & demographics; no revenue or counselor details",
    allowedTabs: ["overview", "funnel", "programs", "market"],
  },
  {
    id: "ST",
    name: "Applicant / Student",
    role: "Personal Portal",
    badgeBg: "bg-rose-600",
    badgeText: "text-white",
    accessDesc:
      "Personal seat availability, program details & application checklist",
    allowedTabs: ["overview", "programs"],
  },
];

export const TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  funnel: "Admissions Funnel",
  yield: "Enrollment & Yield",
  revenue: "Revenue",
  programs: "Programs & Capacity",
  counselor: "Counselor Insights",
  reviewer: "Reviewer Operations",
  market: "Market & Demographics",
  executive: "Executive Intelligence",
};

export const KPI_DATA: Record<PersonaId, KPIItem[]> = {
  AD: [
    {
      label: "Total Applications",
      value: "15,000",
      delta: "+0% vs target",
      deltaType: "neutral",
    },
    {
      label: "Total Enrollments",
      value: "3,000",
      delta: "At target",
      deltaType: "emerald",
    },
    {
      label: "Revenue Collected",
      value: "₹175M",
      delta: "+₹5M vs plan",
      deltaType: "emerald",
    },
    {
      label: "Enrollment Yield",
      value: "20.0%",
      delta: "+0.0% variance",
      deltaType: "neutral",
    },
    {
      label: "Seat Utilization",
      value: "98.7%",
      delta: "-1.3% vs capacity",
      deltaType: "rose",
    },
    {
      label: "Conversion Rate",
      value: "20.0%",
      delta: "+0.5% vs YoY",
      deltaType: "emerald",
    },
  ],
  RG: [
    {
      label: "Total Capacity",
      value: "4,560 seats",
      delta: "38 specializations",
      deltaType: "neutral",
    },
    {
      label: "Seats Allocated",
      value: "4,500",
      delta: "98.7% filled",
      deltaType: "emerald",
    },
    {
      label: "Seat Utilization",
      value: "98.7%",
      delta: "Near capacity limit",
      deltaType: "rose",
    },
    {
      label: "Enrolled Students",
      value: "3,000",
      delta: "Target reached",
      deltaType: "emerald",
    },
    {
      label: "Admission Fee Paid",
      value: "3,200",
      delta: "93.8% fee rate",
      deltaType: "emerald",
    },
    {
      label: "Final Yield Rate",
      value: "20.0%",
      delta: "+0.2% vs target",
      deltaType: "emerald",
    },
  ],
  CM: [
    {
      label: "Apps Managed",
      value: "15,000",
      delta: "100% assigned",
      deltaType: "emerald",
    },
    {
      label: "Team Enrollments",
      value: "3,000",
      delta: "42.8 avg/counselor",
      deltaType: "emerald",
    },
    {
      label: "Team Conversion",
      value: "20.0%",
      delta: "Target 18.5%",
      deltaType: "emerald",
    },
    {
      label: "Comms Sent",
      value: "100,000",
      delta: "Avg 6.6 per app",
      deltaType: "neutral",
    },
    {
      label: "Active Counselors",
      value: "70",
      delta: "Full capacity",
      deltaType: "neutral",
    },
    {
      label: "Avg Enrolled/Counselor",
      value: "43",
      delta: "+3 vs last month",
      deltaType: "emerald",
    },
  ],
  RV: [
    {
      label: "Reviews Completed",
      value: "9,500",
      delta: "100% on schedule",
      deltaType: "emerald",
    },
    {
      label: "Active Reviewers",
      value: "35",
      delta: "271 rev/person",
      deltaType: "neutral",
    },
    {
      label: "Docs Verified",
      value: "113,552",
      delta: "Across 4 campuses",
      deltaType: "emerald",
    },
    {
      label: "Verification Pending",
      value: "142",
      delta: "Review required",
      deltaType: "amber",
    },
    {
      label: "Avg Review Score",
      value: "78.5",
      delta: "/100 scale",
      deltaType: "neutral",
    },
    {
      label: "Compliance Rate",
      value: "95.2%",
      delta: "Above 95.0% SLA",
      deltaType: "emerald",
    },
  ],
  MK: [
    {
      label: "Total Applications",
      value: "15,000",
      delta: "Target met",
      deltaType: "emerald",
    },
    {
      label: "Top Program",
      value: "B.Tech CS",
      delta: "3,422 applications",
      deltaType: "neutral",
    },
    {
      label: "Top State",
      value: "Karnataka",
      delta: "3,960 apps (26.4%)",
      deltaType: "neutral",
    },
    {
      label: "Top Intake",
      value: "July 2027",
      delta: "11,968 apps",
      deltaType: "emerald",
    },
    {
      label: "Inbound Yield",
      value: "20.0%",
      delta: "+0.8% organic",
      deltaType: "emerald",
    },
    {
      label: "Overall Conversion",
      value: "20.0%",
      delta: "High intent traffic",
      deltaType: "emerald",
    },
  ],
  ST: [
    {
      label: "Target Program",
      value: "B.Tech AI",
      delta: "July 2027 Intake",
      deltaType: "emerald",
    },
    {
      label: "Program Capacity",
      value: "120 Seats",
      delta: "Main Campus",
      deltaType: "neutral",
    },
    {
      label: "Seats Allocated",
      value: "132 Seats",
      delta: "Oversubscribed 110%",
      deltaType: "rose",
    },
    {
      label: "Seat Utilization",
      value: "110.0%",
      delta: "High Demand",
      deltaType: "amber",
    },
    {
      label: "Intake Period",
      value: "July 2027",
      delta: "Phase 1 Active",
      deltaType: "emerald",
    },
    {
      label: "Application Status",
      value: "Allocated",
      delta: "Fee Due Nov 30",
      deltaType: "amber",
    },
  ],
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  // Persona state
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>("AD");
  // Persona dropdown toggle
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState<boolean>(false);
  // Active Tab state
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  // Trajectory range state
  const [trajectoryRange, setTrajectoryRange] = useState<"3M" | "6M" | "12M">(
    "12M",
  );
  // Genie drawer toggle & conversation state
  const [isGenieOpen, setIsGenieOpen] = useState<boolean>(false);
  const [genieInput, setGenieInput] = useState<string>("");
  const [genieMessages, setGenieMessages] = useState<
    Array<{ sender: "user" | "genie"; text: string }>
  >([
    {
      sender: "genie",
      text: "👋 Hello Admissions Director. Ask me about enrollment, revenue, program capacity, or counselor performance.",
    },
  ]);
  const [isGenieThinking, setIsGenieThinking] = useState<boolean>(false);

  // Table search & filter
  const [tableSearch, setTableSearch] = useState<string>("");

  const currentPersona = useMemo(
    () => PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0],
    [activePersonaId],
  );

  // Theme-based class definitions
  const isDark = theme === "dark";
  const bgMain = isDark
    ? "bg-[#0f172a] text-slate-100"
    : "bg-[#f8f9fa] text-slate-900";
  const bgCard = isDark ? "bg-[#1e293b]" : "bg-white";
  const bgHeader = isDark
    ? "bg-[#0f172a]/95 border-slate-800"
    : "bg-white/95 border-slate-200";
  const borderDivider = isDark ? "border-slate-800" : "border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textSubtle = isDark ? "text-slate-500" : "text-slate-400";
  const bgHover = isDark ? "hover:bg-slate-800" : "hover:bg-slate-100";
  const bgInput = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100"
    : "bg-slate-50 border-slate-200 text-slate-900";

  // Persona Switch Handler
  const handlePersonaSwitch = (pId: PersonaId) => {
    setActivePersonaId(pId);
    setIsPersonaMenuOpen(false);
    const newPersona = PERSONAS.find((p) => p.id === pId);
    if (newPersona && !newPersona.allowedTabs.includes(activeTab)) {
      setActiveTab(newPersona.allowedTabs[0]);
    }
    // Update Genie greeting
    setGenieMessages([
      {
        sender: "genie",
        text: `👋 Hello ${newPersona?.name}. How can I assist you with ${newPersona?.role} metrics today?`,
      },
    ]);
  };

  // Trajectory chart calculation
  const trajectoryData = useMemo(() => {
    const count =
      trajectoryRange === "3M" ? 3 : trajectoryRange === "6M" ? 6 : 12;
    return MOCK_MONTHLY_TREND.slice(-count);
  }, [trajectoryRange]);

  // Genie response generator
  const handleSendGenie = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!genieInput.trim()) return;

    const userQ = genieInput;
    setGenieMessages((prev) => [...prev, { sender: "user", text: userQ }]);
    setGenieInput("");
    setIsGenieThinking(true);

    setTimeout(() => {
      let response = "";
      const lower = userQ.toLowerCase();

      if (activePersonaId === "ST") {
        response =
          "Based on current live allocation, B.Tech AI has 132 allocated seats against 120 target capacity (110% utilization). Your application fee status is paid and admission fee is due Nov 30.";
      } else if (activePersonaId === "RV") {
        response =
          "There are currently 142 document verifications pending across 4 campuses. Reviewer compliance is holding steady at 95.2%. REV0019 is leading with 307 completed reviews.";
      } else if (lower.includes("revenue") || lower.includes("fee")) {
        response =
          "Total revenue collected stands at ₹175M (₹13.8M application fees + ₹160M admission fees). Avg transaction value is ₹9,615 across 18,200 total processed records.";
      } else if (lower.includes("counselor") || lower.includes("conversion")) {
        response =
          "The counselor team average conversion is 20.0%. Yahvi Venkataraman leads the cohort with a 23.2% yield and 54 confirmed enrollments.";
      } else if (lower.includes("capacity") || lower.includes("program")) {
        response =
          "8 of 38 specializations are oversubscribed. Finance (200.8%) and Marketing (199.2%) have reached max waitlist limits.";
      } else {
        response = `[Databricks Genie AI] Query executed against Databricks view 'vw_admissions_funnel'. Overall funnel conversion is 20.0% with 3,000 final enrollments out of 15,000 applications.`;
      }

      setGenieMessages((prev) => [
        ...prev,
        { sender: "genie", text: response },
      ]);
      setIsGenieThinking(false);
    }, 600);
  };

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    if (!tableSearch) return MOCK_APPLICANTS_360;
    const query = tableSearch.toLowerCase();
    return MOCK_APPLICANTS_360.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.program.toLowerCase().includes(query) ||
        a.specialization.toLowerCase().includes(query) ||
        a.status.toLowerCase().includes(query) ||
        a.counselor.toLowerCase().includes(query),
    );
  }, [tableSearch]);

  return (
    <div
      className={`min-h-screen ${bgMain} font-sans text-xs transition-colors duration-200 antialiased`}
    >
      {/* ========================================================================= */}
      {/* 1. STICKY TOP HEADER */}
      {/* ========================================================================= */}
      <header
        className={`sticky top-0 z-30 ${bgHeader} border-b backdrop-blur-md px-4 lg:px-6 py-2.5 transition-colors`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Left Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-tight">
              <span className={textMuted}>databricks</span>
              <span className={textMuted}>/</span>
              <span className="font-semibold text-indigo-500">
                admissions-governance
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-48 lg:w-60">
              <Search
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textMuted}`}
              />
              <input
                type="text"
                placeholder="Search ⌘K..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-md border ${bgInput} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
            </div>

            {/* Intake Select */}
            <div className="relative">
              <select
                defaultValue="July 2027 Intake"
                className={`appearance-none pl-3 pr-7 py-1.5 rounded-md border ${bgInput} font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer`}
              >
                <option value="July 2027 Intake">July 2027 Intake</option>
                <option value="January 2027 Intake">January 2027 Intake</option>
                <option value="January 2028 Intake">January 2028 Intake</option>
                <option value="AY 2026-27">AY 2026-27</option>
              </select>
              <ChevronDown
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${textMuted}`}
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-1.5 rounded-md border ${borderDivider} ${bgHover} transition-colors`}
              title="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notifications */}
            <button
              className={`p-1.5 rounded-md border ${borderDivider} ${bgHover} relative transition-colors`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>

            {/* RBAC Persona Governance Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-md border ${borderDivider} ${bgHover} transition-colors`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${currentPersona.badgeBg} ${currentPersona.badgeText}`}
                >
                  {currentPersona.id}
                </div>
                <span className="font-medium hidden sm:inline">
                  {currentPersona.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Persona Selector Modal/Dropdown */}
              {isPersonaMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-lg border ${borderDivider} ${bgCard} shadow-xl z-50 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div
                    className={`flex items-center justify-between pb-2 border-b ${borderDivider}`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-500" />
                      <div>
                        <div className="font-bold text-xs">
                          RBAC Persona Governance
                        </div>
                        <div className={`text-[10px] ${textSubtle}`}>
                          Switch persona to test role-based view
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                    {PERSONAS.map((p) => {
                      const isActive = p.id === activePersonaId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handlePersonaSwitch(p.id)}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-md transition-colors text-left ${
                            isActive
                              ? isDark
                                ? "bg-indigo-950/50 border border-indigo-800/50"
                                : "bg-indigo-50 border border-indigo-200"
                              : bgHover
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${p.badgeBg} ${p.badgeText}`}
                          >
                            {p.id}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs leading-none">
                                {p.name}
                              </span>
                              {isActive && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              )}
                            </div>
                            <div
                              className={`text-[10px] mt-1 line-clamp-1 ${textMuted}`}
                            >
                              {p.accessDesc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`pt-2 border-t ${borderDivider} flex items-center justify-between text-[10px]`}
                  >
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Databricks Governance: Active
                    </span>
                    <button
                      onClick={() => setIsPersonaMenuOpen(false)}
                      className={`underline ${textMuted} hover:text-indigo-500`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVIGATION TAB STRIP */}
      {/* ========================================================================= */}
      <nav
        className={`border-b ${borderDivider} ${bgCard} px-4 lg:px-6 py-1 sticky top-[49px] z-20`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {currentPersona.allowedTabs.map((tabId) => {
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-t-md border-b-2 transition-all ${
                    isActive
                      ? isDark
                        ? "border-indigo-400 text-indigo-400 font-semibold"
                        : "border-slate-900 text-slate-900 font-semibold"
                      : `border-transparent ${textMuted} hover:text-slate-200`
                  }`}
                >
                  {TAB_LABELS[tabId]}
                </button>
              );
            })}
          </div>

          <div
            className={`hidden lg:flex items-center gap-1.5 text-[11px] ${textMuted} shrink-0`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Role View:</span>
            <span className="font-semibold text-indigo-400">
              {currentPersona.name}
            </span>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6">
        {/* ======================================================================= */}
        {/* PERSONA-ADJUSTED KPI STRIP */}
        {/* ======================================================================= */}
        <section
          className={`rounded-lg border ${borderDivider} ${bgCard} overflow-hidden shadow-xs`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            {KPI_DATA[activePersonaId].map((kpi, idx) => (
              <div key={idx} className="p-3.5 space-y-1">
                <div
                  className={`text-[11px] font-medium ${textMuted} truncate`}
                >
                  {kpi.label}
                </div>
                <div className="text-xl font-bold tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  {kpi.deltaType === "emerald" && (
                    <span className="text-emerald-500 font-semibold flex items-center">
                      <ArrowUpRight className="w-3 h-3" />
                      {kpi.delta}
                    </span>
                  )}
                  {kpi.deltaType === "rose" && (
                    <span className="text-rose-500 font-semibold flex items-center">
                      <ArrowDownRight className="w-3 h-3" />
                      {kpi.delta}
                    </span>
                  )}
                  {kpi.deltaType === "amber" && (
                    <span className="text-amber-500 font-semibold flex items-center">
                      <AlertTriangle className="w-3 h-3" />
                      {kpi.delta}
                    </span>
                  )}
                  {kpi.deltaType === "neutral" && (
                    <span className={`${textSubtle}`}>{kpi.delta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* TAB CONTENT WIDGETS */}
        {/* ======================================================================= */}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funnel Variance Widget (A) */}
              <FunnelVarianceCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* Trajectory Line Chart Widget (G) */}
              <TrajectoryChartCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
                trajectoryRange={trajectoryRange}
                setTrajectoryRange={setTrajectoryRange}
                trajectoryData={trajectoryData}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Program Demand (K) */}
              <ProgramDemandCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* Revenue Waterfall Mini (D) */}
              <RevenueWaterfallCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* State Benchmark Mini (E) */}
              <StateBenchmarkCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />
            </div>
          </div>
        )}

        {/* ADMISSIONS FUNNEL TAB */}
        {activeTab === "funnel" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Drop-off Ladder Widget (B) */}
              <div className="lg:col-span-2">
                <StageDropoffCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
              </div>

              {/* Velocity List Widget (C) */}
              <div>
                <StageVelocityCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelVarianceCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />
              <TrajectoryChartCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
                trajectoryRange={trajectoryRange}
                setTrajectoryRange={setTrajectoryRange}
                trajectoryData={trajectoryData}
              />
            </div>
          </div>
        )}

        {/* ENROLLMENT & YIELD TAB */}
        {activeTab === "yield" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Intake Comparison Widget (H) */}
              <div className="lg:col-span-2">
                <IntakeComparisonCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
              </div>

              {/* Fee Paid Split Mini Card */}
              <div
                className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">
                      Fee Payment Conversion
                    </div>
                    <div className={`text-[11px] ${textMuted}`}>
                      Application fee payment health
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                    91.97% Fee Rate
                  </span>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Application Fee Paid</span>
                      <span className="font-semibold">13,796 (92.0%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Unpaid / Abandoned</span>
                      <span className="font-semibold text-rose-400">
                        1,204 (8.0%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: "8%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
                >
                  // bind: vw_paid_vs_unpaid_applications · 13,796 total
                  payments received
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CapacityUtilizationCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />
              <StageDropoffCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />
            </div>
          </div>
        )}

        {/* REVENUE TAB */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueWaterfallCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* Revenue by Program Breakdown */}
              <div
                className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">
                      Revenue by Program Leader
                    </div>
                    <div className={`text-[11px] ${textMuted}`}>
                      Estimated revenue split across top faculties
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                    ₹175M Total
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "B.Tech CS & AI", rev: "₹75.4M", pct: 43 },
                    { name: "MBA Programs", rev: "₹48.2M", pct: 27 },
                    { name: "MBBS Medicine", rev: "₹32.1M", pct: 18 },
                    { name: "BBA Digital Business", rev: "₹12.5M", pct: 7 },
                    { name: "Other Specializations", rev: "₹6.8M", pct: 5 },
                  ].map((p, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{p.name}</span>
                        <span className="font-semibold">
                          {p.rev} ({p.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${p.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
                >
                  // bind: vw_revenue_by_program · B.Tech CS dominates 43%
                  revenue volume
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRAMS & CAPACITY TAB */}
        {activeTab === "programs" && (
          <div className="space-y-6">
            {activePersonaId === "ST" ? (
              /* STUDENT SPECIFIC VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CapacityUtilizationCard
                    isDark={isDark}
                    borderDivider={borderDivider}
                    bgCard={bgCard}
                    textMuted={textMuted}
                  />
                </div>
                {/* Student Personal Application Checklist (M) */}
                <div
                  className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
                >
                  <div>
                    <div className="text-sm font-bold">
                      My Application Checklist
                    </div>
                    <div className={`text-[11px] ${textMuted}`}>
                      Target: B.Tech Artificial Intelligence
                    </div>
                  </div>

                  <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-xs">
                          Application Submitted
                        </div>
                        <div className={`text-[10px] ${textMuted}`}>
                          Completed on Oct 12, 2026
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-xs">
                          Entrance Score Submitted
                        </div>
                        <div className={`text-[10px] ${textMuted}`}>
                          Verified on Oct 20, 2026
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-xs">Shortlisted</div>
                        <div className={`text-[10px] ${textMuted}`}>
                          Qualified on Nov 02, 2026
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ✓
                      </div>
                      <div>
                        <div className="font-semibold text-xs">
                          Seat Allocated
                        </div>
                        <div className={`text-[10px] ${textMuted}`}>
                          B.Tech AI Allocated Nov 08
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                        ⏳
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-amber-500">
                          Admission Fee Payment
                        </div>
                        <div className="text-[10px] text-rose-500 font-medium">
                          Due Date: Nov 30, 2026 (₹500,000)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 relative opacity-60">
                      <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-xs shrink-0">
                        ○
                      </div>
                      <div>
                        <div className="font-semibold text-xs">
                          Enrollment Confirmation
                        </div>
                        <div className={`text-[10px] ${textMuted}`}>
                          Pending Fee Payment
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
                  >
                    // bind: fact_application · Application ID: APP-10291
                  </div>
                </div>
              </div>
            ) : (
              /* REGULAR PERSONA VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CapacityUtilizationCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
                <ProgramDemandCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
              </div>
            )}
          </div>
        )}

        {/* COUNSELOR INSIGHTS TAB */}
        {activeTab === "counselor" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Counselor Leaderboard (I) */}
              <div className="lg:col-span-2">
                <CounselorLeaderboardCard
                  isDark={isDark}
                  borderDivider={borderDivider}
                  bgCard={bgCard}
                  textMuted={textMuted}
                />
              </div>

              {/* Communication Stats */}
              <div
                className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">
                      Communication Summary
                    </div>
                    <div className={`text-[11px] ${textMuted}`}>
                      Outbound outreach volume
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400">
                    100k Total
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-slate-800/40 border border-slate-700/50 space-y-1">
                    <div className={`text-[10px] ${textMuted}`}>
                      Email Communications
                    </div>
                    <div className="text-lg font-bold">
                      64,200{" "}
                      <span className="text-xs font-normal text-emerald-400">
                        (64.2%)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-slate-800/40 border border-slate-700/50 space-y-1">
                    <div className={`text-[10px] ${textMuted}`}>
                      WhatsApp Outreach
                    </div>
                    <div className="text-lg font-bold">
                      25,800{" "}
                      <span className="text-xs font-normal text-indigo-400">
                        (25.8%)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-slate-800/40 border border-slate-700/50 space-y-1">
                    <div className={`text-[10px] ${textMuted}`}>
                      Direct Phone Calls
                    </div>
                    <div className="text-lg font-bold">
                      10,000{" "}
                      <span className="text-xs font-normal text-amber-400">
                        (10.0%)
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
                >
                  // bind: vw_counselor_communication_summary · Avg 6.6 touches
                  per applicant
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEWER OPERATIONS TAB */}
        {activeTab === "reviewer" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reviewer Productivity Widget (J1) */}
              <ReviewerProductivityCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* Document Verification Audit Widget (J2) */}
              <VerificationAuditCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />
            </div>
          </div>
        )}

        {/* MARKET & DEMOGRAPHICS TAB */}
        {activeTab === "market" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StateBenchmarkCard
                isDark={isDark}
                borderDivider={borderDivider}
                bgCard={bgCard}
                textMuted={textMuted}
              />

              {/* City Level Breakdown */}
              <div
                className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">Top Metro Drivers</div>
                    <div className={`text-[11px] ${textMuted}`}>
                      City-level application source
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                    Bengaluru Lead
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { city: "Bengaluru", count: 2840, pct: 18.9 },
                    { city: "Chennai", count: 1210, pct: 8.1 },
                    { city: "Hyderabad", count: 1050, pct: 7.0 },
                    { city: "Kochi", count: 890, pct: 5.9 },
                    { city: "Mangalore", count: 750, pct: 5.0 },
                  ].map((c, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{c.city}</span>
                        <span className="font-semibold">
                          {c.count} ({c.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${c.pct * 4}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
                >
                  // bind: vw_city_wise_applications · Indicative city
                  concentration metrics
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXECUTIVE INTELLIGENCE TAB */}
        {activeTab === "executive" && (
          <div className="space-y-6">
            {/* Applicant 360 Drill Table (L) */}
            <div
              className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold flex items-center gap-2">
                    Applicant 360 Master Drill
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-normal">
                      Live Table
                    </span>
                  </div>
                  <div className={`text-[11px] ${textMuted}`}>
                    Individual applicant lifecycle records & status tracking
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search
                      className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 ${textMuted}`}
                    />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Filter records..."
                      className={`w-full pl-7 pr-3 py-1 text-xs rounded border ${bgInput} focus:outline-none`}
                    />
                  </div>
                  <button
                    className={`flex items-center gap-1 px-2.5 py-1 rounded border ${borderDivider} ${bgHover} font-medium text-xs`}
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b ${borderDivider} ${isDark ? "bg-slate-800/50" : "bg-slate-50"}`}
                    >
                      <th className="p-2 font-semibold">Applicant</th>
                      <th className="p-2 font-semibold">Program</th>
                      <th className="p-2 font-semibold">Specialization</th>
                      <th className="p-2 font-semibold">Status</th>
                      <th className="p-2 font-semibold">Counselor</th>
                      <th className="p-2 font-semibold">App Fee</th>
                      <th className="p-2 font-semibold">Paid Amount</th>
                      <th className="p-2 font-semibold">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderDivider}`}>
                    {filteredApplicants.map((a) => (
                      <tr key={a.id} className={`${bgHover} transition-colors`}>
                        <td className="p-2 font-medium">
                          <div>{a.name}</div>
                          <div
                            className={`text-[10px] font-mono ${textSubtle}`}
                          >
                            {a.id}
                          </div>
                        </td>
                        <td className="p-2">{a.program}</td>
                        <td className="p-2">{a.specialization}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              a.status === "Enrolled"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : a.status === "Seat Allocated"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-indigo-500/10 text-indigo-400"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="p-2">{a.counselor}</td>
                        <td className="p-2">{a.feePaid}</td>
                        <td className="p-2 font-mono">{a.amount}</td>
                        <td className="p-2">
                          <span
                            className={`font-semibold ${a.enrolled === "Yes" ? "text-emerald-400" : textMuted}`}
                          >
                            {a.enrolled}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className={`pt-3 border-t ${borderDivider} flex items-center justify-between text-[11px] ${textMuted}`}
              >
                <span>
                  Showing {filteredApplicants.length} of 15,000 records
                </span>
                <span>// bind: vw_applicant_360</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. ASK GENIE SLIDE-OVER DRAWER & FIXED TAB BUTTON */}
      {/* ========================================================================= */}
      {/* Fixed Vertical Trigger Tab */}
      <button
        onClick={() => setIsGenieOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 dark:bg-indigo-600 text-white font-semibold py-3 px-1.5 rounded-l-md shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-indigo-500 transition-colors"
        style={{ writingMode: "vertical-rl" }}
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="tracking-wide text-xs">Ask Genie +</span>
      </button>

      {/* Drawer Overlay */}
      {isGenieOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsGenieOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          ></div>

          {/* Slide-over Content Drawer */}
          <div
            className={`relative w-full max-w-md ${bgCard} border-l ${borderDivider} shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${borderDivider} flex items-center justify-between ${isDark ? "bg-slate-900/50" : "bg-slate-50"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Ask Admissions AI</div>
                  <div className={`text-[10px] ${textMuted}`}>
                    Databricks Genie Engine (NL-to-SQL)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsGenieOpen(false)}
                className={`p-1 rounded ${bgHover}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {genieMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none ml-6"
                        : isDark
                          ? "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50 mr-6"
                          : "bg-indigo-50 text-slate-900 rounded-bl-none border border-indigo-100 mr-6"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isGenieThinking && (
                <div className="flex justify-start">
                  <div
                    className={`p-2.5 rounded-lg text-[11px] italic text-indigo-400 bg-indigo-950/30 border border-indigo-800/30 animate-pulse`}
                  >
                    Databricks Genie processing query...
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSendGenie}
              className={`p-3 border-t ${borderDivider} flex gap-2`}
            >
              <input
                type="text"
                value={genieInput}
                onChange={(e) => setGenieInput(e.target.value)}
                placeholder="Ask about conversion, revenue, yield..."
                className={`flex-1 px-3 py-1.5 text-xs rounded border ${bgInput} focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {/* GENIE_SPACE_ID: admissions_genie_space_prod_01 */}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENT CARDS (WIDGETS)
// ============================================================================

// Widget A: Funnel Variance Card
function FunnelVarianceCard({ isDark, borderDivider, bgCard, textMuted }: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Admissions Funnel Variance</div>
          <div className={`text-[11px] ${textMuted}`}>
            Stage-wise actual volume vs target benchmark
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>Target
            Dot
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Actual
            Fill
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {MOCK_FUNNEL_VARIANCE.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{item.stage}</span>
              <div className="space-x-1.5">
                <span className="font-mono font-semibold">
                  {item.actual.toLocaleString()}
                </span>
                {item.variance > 0 && (
                  <span className="text-emerald-500 text-[10px] font-bold">
                    (+{item.variance})
                  </span>
                )}
              </div>
            </div>
            {/* Track */}
            <div className="relative w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-visible">
              {/* Fill */}
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${item.pct}%` }}
              ></div>
              {/* Target Dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 border-2 border-slate-900 rounded-full z-10 shadow-sm"
                style={{ left: `calc(${item.targetPct}% - 6px)` }}
                title={`Target: ${item.target.toLocaleString()}`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} flex items-center justify-between text-[11px] ${textMuted}`}
      >
        <span>Overall conversion rate: 20.0%</span>
        <span className="text-emerald-500 font-medium">
          // bind: vw_admissions_funnel
        </span>
      </div>
    </div>
  );
}

// Widget B: Stage Dropoff Ladder
function StageDropoffCard({ isDark, borderDivider, bgCard, textMuted }: any) {
  const maxCount = 15000;
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Stage Drop-off Ladder</div>
          <div className={`text-[11px] ${textMuted}`}>
            9-stage sequential transition & conversion %
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
          9 Stages
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_STAGE_DROPOFF.map((stage, i) => {
          const widthPct = (stage.count / maxCount) * 100;
          return (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{stage.stage}</span>
                <div className="space-x-2">
                  <span className="font-mono">
                    {stage.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    ({stage.conversion}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_stage_dropoff · Maximum conversion retention at confirmed
        enrollment (93.8%)
      </div>
    </div>
  );
}

// Widget C: Stage Velocity
function StageVelocityCard({ isDark, borderDivider, bgCard, textMuted }: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Stage Velocity</div>
          <div className={`text-[11px] ${textMuted}`}>
            Average duration in stage (Days)
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
          Indicative
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_STAGE_VELOCITY.map((v, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="truncate max-w-[140px]">{v.stage}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(v.days / 8) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono text-[11px] font-semibold w-8 text-right">
                {v.days}d
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: application_status_history.duration_days
      </div>
    </div>
  );
}

// Widget G: Trajectory SVG Line Chart Card
function TrajectoryChartCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
  trajectoryRange,
  setTrajectoryRange,
  trajectoryData,
}: any) {
  // SVG points calculation
  const maxApps = 1200;
  const width = 400;
  const height = 100;

  const appPoints = trajectoryData
    .map((d: any, idx: number) => {
      const x = (idx / (trajectoryData.length - 1)) * width;
      const y = height - (d.apps / maxApps) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const enrollPoints = trajectoryData
    .map((d: any, idx: number) => {
      const x = (idx / (trajectoryData.length - 1)) * width;
      const y = height - ((d.enrollments * 4) / maxApps) * height; // scaled for visibility
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-sm font-bold">Application Trajectory Trend</div>
          <div className={`text-[11px] ${textMuted}`}>
            Monthly volume run-rate comparison
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded border border-slate-700/50 text-[10px]">
          {(["3M", "6M", "12M"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTrajectoryRange(r)}
              className={`px-2 py-0.5 rounded font-medium transition-all ${
                trajectoryRange === r
                  ? "bg-indigo-600 text-white shadow-xs"
                  : `${textMuted} hover:text-white`
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative pt-2">
        <svg
          viewBox="0 0 400 100"
          className="w-full h-28 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Gridlines */}
          <line
            x1="0"
            y1="20"
            x2="400"
            y2="20"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            strokeDasharray="3 3"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="50"
            x2="400"
            y2="50"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            strokeDasharray="3 3"
            strokeWidth="0.5"
          />
          <line
            x1="0"
            y1="80"
            x2="400"
            y2="80"
            stroke={isDark ? "#334155" : "#e2e8f0"}
            strokeDasharray="3 3"
            strokeWidth="0.5"
          />

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            points={appPoints}
          />
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            points={enrollPoints}
          />
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-end gap-4 mt-2 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-indigo-500 rounded"></span>{" "}
            Applications
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 rounded"></span> Enrollments
            (Scaled)
          </span>
        </div>
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} flex items-center justify-between text-[11px] ${textMuted}`}
      >
        <span>Peak month: 2026-10 (1,068 apps)</span>
        <span>// bind: vw_monthly_trend</span>
      </div>
    </div>
  );
}

// Widget F: Capacity Utilization Card
function CapacityUtilizationCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">
            Capacity Utilization & Allocation
          </div>
          <div className={`text-[11px] ${textMuted}`}>
            Oversubscribed specializations highlighted
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
          8 Oversubscribed
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_CAPACITY_UTILIZATION.map((item, i) => {
          let barColor = "bg-emerald-500";
          let chipColor = "bg-emerald-500/10 text-emerald-400";
          if (item.pct >= 100) {
            barColor = "bg-rose-500";
            chipColor = "bg-rose-500/10 text-rose-400";
          } else if (item.pct >= 90) {
            barColor = "bg-amber-500";
            chipColor = "bg-amber-500/10 text-amber-400";
          }

          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px]">
                    {item.allocated}/{item.capacity} ({item.pct.toFixed(1)}%)
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${chipColor}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`${barColor} h-full rounded-full`}
                  style={{ width: `${Math.min(item.pct / 2, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] text-rose-400 font-medium`}
      >
        // bind: vw_specialization_capacity_utilization · 8 specializations
        require seat re-allocation
      </div>
    </div>
  );
}

// Widget D: Revenue Waterfall Card
function RevenueWaterfallCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Revenue Waterfall</div>
          <div className={`text-[11px] ${textMuted}`}>
            Fee collection bridge (INR Millions)
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
          ₹175M Total
        </span>
      </div>

      {/* Waterfall Bar Columns */}
      <div className="h-36 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-700/50 px-4">
        {MOCK_REVENUE_WATERFALL.map((bar, i) => {
          const heightPct =
            bar.type === "total"
              ? 100
              : bar.type === "base"
                ? 5
                : (bar.amount / 175) * 100;
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
            >
              <span className="text-[10px] font-mono font-bold">
                {bar.display}
              </span>
              <div
                className={`w-full rounded-t ${
                  bar.type === "total"
                    ? "bg-indigo-600"
                    : bar.type === "base"
                      ? "bg-slate-600"
                      : "bg-emerald-500"
                }`}
                style={{ height: `${heightPct}%` }}
              ></div>
              <span className="text-[10px] text-center line-clamp-1 truncate">
                {bar.stage}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} flex items-center justify-between text-[11px] ${textMuted}`}
      >
        <span>18,200 total transactions</span>
        <span>Avg payment: ₹9,615</span>
      </div>
    </div>
  );
}

// Widget E: State Benchmark Card
function StateBenchmarkCard({ isDark, borderDivider, bgCard, textMuted }: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">State Geographic Benchmark</div>
          <div className={`text-[11px] ${textMuted}`}>
            Application share by home state
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
          Karnataka Lead
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_STATE_WISE.map((st, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{st.state}</span>
              <span className="font-mono font-semibold">
                {st.count.toLocaleString()} ({st.pct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`${st.color} h-full rounded-full`}
                style={{ width: `${st.pct * 3}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_state_wise_applications · Home state (Karnataka) contributes
        26.4%
      </div>
    </div>
  );
}

// Widget H: Intake Comparison Card
function IntakeComparisonCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Intake Performance Comparison</div>
          <div className={`text-[11px] ${textMuted}`}>
            Volume & yield breakdown by intake cohort
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_INTAKE_TREND.map((item, i) => (
          <div
            key={i}
            className="p-3.5 rounded-lg border border-slate-700/50 bg-slate-800/30 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{item.intake}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {item.yield}% Yield
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className={textMuted}>Applications</span>
                <span className="font-mono font-semibold">
                  {item.apps.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className={textMuted}>Enrolled</span>
                <span className="font-mono font-semibold">
                  {item.enrolled.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-full`}
                style={{ width: `${item.yield * 3}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_intake_trend · Jan 2028 intake trending highest yield
        (+1.86pt)
      </div>
    </div>
  );
}

// Widget I: Counselor Leaderboard Card
function CounselorLeaderboardCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Counselor Leaderboard</div>
          <div className={`text-[11px] ${textMuted}`}>
            Top converting team members
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
          70 Active
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_COUNSELOR_LEADERBOARD.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs p-2 rounded-md bg-slate-800/20 border border-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-slate-500 w-4 font-bold">
                {i + 1}
              </span>
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className={`text-[10px] ${textMuted}`}>
                  {c.apps} apps managed
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-mono font-bold">{c.enrolled} Enrolled</div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  {c.conversion}% conv
                </div>
              </div>
              {c.isTop && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Top 3
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_counselor_performance · Team avg conversion 20%
      </div>
    </div>
  );
}

// Widget J1: Reviewer Productivity Card
function ReviewerProductivityCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Reviewer Productivity</div>
          <div className={`text-[11px] ${textMuted}`}>
            Reviews completed per active reviewer
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
          35 Reviewers
        </span>
      </div>

      <div className="space-y-2.5">
        {MOCK_REVIEWER_PRODUCTIVITY.map((rev, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="font-mono font-medium">{rev.id}</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(rev.reviews / 320) * 100}%` }}
                ></div>
              </div>
              <span className="font-mono font-bold w-8 text-right">
                {rev.reviews}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_reviewer_productivity · 9,500 total reviews completed
      </div>
    </div>
  );
}

// Widget J2: Verification Audit Card
function VerificationAuditCard({
  isDark,
  borderDivider,
  bgCard,
  textMuted,
}: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Document Verification Audit</div>
          <div className={`text-[11px] ${textMuted}`}>
            Campus-wise document verification queue
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
          95.2% Compliance
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_VERIFICATION_AUDIT.map((camp, i) => (
          <div
            key={i}
            className="p-3 rounded-md bg-slate-800/30 border border-slate-700/50 space-y-1.5"
          >
            <div className="flex justify-between text-xs">
              <span className="font-bold">{camp.campus} Campus</span>
              <span className="text-emerald-400 font-semibold">
                {camp.pct}% Verified
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Verified: {camp.verified.toLocaleString()}</span>
              <span className="text-amber-400 font-medium">
                Pending: {camp.pending}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: document_verification · 142 total pending across all campuses
      </div>
    </div>
  );
}

// Widget K: Program Demand Card
function ProgramDemandCard({ isDark, borderDivider, bgCard, textMuted }: any) {
  return (
    <div
      className={`rounded-lg border ${borderDivider} ${bgCard} p-5 space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Program Demand Rankings</div>
          <div className={`text-[11px] ${textMuted}`}>
            Top faculties by application volume
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {MOCK_PROGRAM_DEMAND.map((prog, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="truncate max-w-[180px]">{prog.name}</span>
              <span className="font-mono font-semibold">
                {prog.apps.toLocaleString()} ({prog.pct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${prog.pct * 3.5}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pt-3 border-t ${borderDivider} text-[11px] ${textMuted}`}
      >
        // bind: vw_program_demand · B.Tech CS accounts for 22.8% of total
        applications
      </div>
    </div>
  );
}
