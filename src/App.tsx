import { useState, useEffect } from "react";
import { 
  Heart, 
  Smile, 
  Compass, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  ArrowRight, 
  Users, 
  Presentation, 
  Activity, 
  MessageSquare, 
  Flame, 
  ChevronRight, 
  Zap, 
  RotateCcw,
  BookOpen,
  Share2,
  Lock,
  Unlock,
  CheckCircle,
  Award,
  Play,
  Pause,
  Video,
  Volume2,
  Tv
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PRESETS, 
  THOUGHT_PRESETS, 
  ConflictPreset, 
  RolePreset,
  JOURNAL_MOODS,
  MOM_ACTIVITIES,
  DAUGHTER_ACTIVITIES,
  DEFAULT_JOURNAL_ENTRIES,
  JOURNAL_PRESETS,
  JournalPreset
} from "./presets";
import { 
  UserRole, 
  TranslationVibe, 
  TranslationResult, 
  ReconcileResult, 
  SavedPact, 
  ChatMessage,
  JournalEntry,
  JournalInsightResult
} from "./types";

export default function App() {
  // Global App States
  const [activeTab, setActiveTab] = useState<"translate" | "reconcile" | "journal" | "presentation">("translate");
  const [harmonyScore, setHarmonyScore] = useState<number>(65);
  const [scoreHistory, setScoreHistory] = useState<number[]>([60, 62, 65]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Configuration: Daughter's profile age (14-22) which controls developmental-stage messaging
  const [daughterAge, setDaughterAge] = useState<number>(19);

  // Feature 1: Empathy Peace Translator States
  const [role, setRole] = useState<UserRole>("mom");
  const [rawThought, setRawThought] = useState<string>("");
  const [vibe, setVibe] = useState<TranslationVibe>("warm");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translationHistory, setTranslationHistory] = useState<ChatMessage[]>([]);

  // Feature 2: Perspective Reconciliation Sandbox States
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [reconcileTopic, setReconcileTopic] = useState<string>("Sleep Schedules & Screen Time");
  const [momView, setMomView] = useState<string>("");
  const [daughterView, setDaughterView] = useState<string>("");
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [reconcileResult, setReconcileResult] = useState<ReconcileResult | null>(null);
  const [momSigned, setMomSigned] = useState<boolean>(false);
  const [daughterSigned, setDaughterSigned] = useState<boolean>(false);
  const [momSignName, setMomSignName] = useState<string>("");
  const [daughterSignName, setDaughterSignName] = useState<string>("");
  const [pactRatified, setPactRatified] = useState<boolean>(false);
  const [pactList, setPactList] = useState<SavedPact[]>([]);

  // Feature 3: Hackathon 2-Min Presentation Mode States
  const [deckStep, setDeckStep] = useState<number>(0);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string>(() => {
    try {
      return localStorage.getItem("empathy_demo_video_url") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("empathy_demo_video_url", demoVideoUrl);
    } catch (e) {
      console.error(e);
    }
  }, [demoVideoUrl]);

  // States for interactive pitch demonstration simulator (2 mins structure)
  const [isPlayingSim, setIsPlayingSim] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  useEffect(() => {
    let intervalId: any = null;
    if (isPlayingSim) {
      intervalId = setInterval(() => {
        setSimTime((prev) => {
          if (prev >= 120) {
            setIsPlayingSim(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlayingSim]);

  // Feature 4: Shared Health & Wellness Journal States
  const [journalRole, setJournalRole] = useState<UserRole>("mom");
  const [journalMood, setJournalMood] = useState<string>("😌 Calm & Centered");
  const [journalMoodEn, setJournalMoodEn] = useState<string>("peaceful");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [journalNotes, setJournalNotes] = useState<string>("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(DEFAULT_JOURNAL_ENTRIES);
  
  const [isAnalyzingJournal, setIsAnalyzingJournal] = useState<boolean>(false);
  const [journalInsight, setJournalInsight] = useState<JournalInsightResult | null>(null);
  const [wellnessStreak, setWellnessStreak] = useState<number>(3);    // Simple interactive reward metrics
  const [coopPoints, setCoopPoints] = useState<number>(120);          // Earned points for family harmony

  // Initialize with general mock presets to make demo easy
  useEffect(() => {
    // Set a default preset on mount to show instant capabilities
    const defaultPreset = PRESETS[0];
    setSelectedPresetId(defaultPreset.id);
    setReconcileTopic(defaultPreset.topic);
    setMomView(defaultPreset.momThought);
    setDaughterView(defaultPreset.daughterThought);
  }, []);

  // Soft notifications / Copy utility
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Run Peace Translation API Call
  const handleTranslate = async () => {
    if (!rawThought.trim()) return;
    setIsTranslating(true);
    setTranslationResult(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, rawThought, vibe, daughterAge }),
      });
      const data = await response.json();
      setTranslationResult(data);

      // Append to local feed timeline
      const newMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: role,
        rawThought,
        translatedText: data.translatedText,
        vibe,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setTranslationHistory(prev => [newMsg, ...prev]);

      // Boost Harmony Score as family positive engagement increases!
      setHarmonyScore(prev => {
        const next = Math.min(prev + 5, 99);
        setScoreHistory(sh => [...sh, next]);
        return next;
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Run Perspective Reconciliation Contract Draft API Call
  const handleReconcile = async () => {
    if (!momView.trim() || !daughterView.trim()) return;
    setIsReconciling(true);
    setReconcileResult(null);
    setPactRatified(false);
    setMomSigned(false);
    setDaughterSigned(false);
    setMomSignName("");
    setDaughterSignName("");

    try {
      const response = await fetch("/api/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: reconcileTopic, momView, daughterView, daughterAge }),
      });
      const data = await response.json();
      setReconcileResult(data);

      setHarmonyScore(prev => {
        const next = Math.min(prev + 8, 100);
        setScoreHistory(sh => [...sh, next]);
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsReconciling(false);
    }
  };

  // Sign & Ratify current Pact
  const handleRatifyCurrentPact = () => {
    if (!reconcileResult) return;
    if (!momSignName.trim() || !daughterSignName.trim()) return;

    setMomSigned(true);
    setDaughterSigned(true);
    setPactRatified(true);

    const saved: SavedPact = {
      ...reconcileResult,
      id: Math.random().toString(36).substr(2, 9),
      momSigned: true,
      daughterSigned: true,
      signedAt: new Date().toLocaleDateString()
    };

    setPactList(prev => [saved, ...prev]);
    setHarmonyScore(100); // Master status reached!
  };

  // Submit today's journal entry in local list
  const handleAddJournalEntry = () => {
    const newEntry: JournalEntry = {
      id: "j-" + Math.random().toString(36).substring(2, 9),
      sender: journalRole,
      mood: journalMood,
      moodEn: journalMoodEn,
      activities: [...selectedActivities],
      notes: journalNotes.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setJournalEntries(prev => [newEntry, ...prev]);
    setSelectedActivities([]);
    setJournalNotes("");
    setJournalInsight(null); // Clear old insights to prompt fresh AI analysis
    
    // Boost score & points a bit
    setHarmonyScore(prev => Math.min(prev + 4, 100));
    setCoopPoints(prev => prev + 15);
    setWellnessStreak(prev => prev + 1);
  };

  // Run AI Wellness insights analyzer
  const handleFetchJournalInsight = async () => {
    setIsAnalyzingJournal(true);
    setJournalInsight(null);
    try {
      const res = await fetch("/api/journal-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: journalEntries })
      });
      const data = await res.json();
      setJournalInsight(data);
      if (data.jointActivityProposal) {
        setCoopPoints(prev => prev + data.jointActivityProposal.happinessPoints);
      }
      setHarmonyScore(prev => Math.min(prev + 8, 100));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingJournal(false);
    }
  };

  // Quick Preset Loader for journal
  const handleLoadJournalPreset = (preset: JournalPreset) => {
    setJournalRole(preset.sender);
    setJournalMood(preset.mood);
    setJournalMoodEn(preset.moodEn);
    setSelectedActivities(preset.activities);
    setJournalNotes(preset.notes);
  };

  // Quick Load Preset for Translator
  const selectThoughtPreset = (p: RolePreset) => {
    setRole(p.role);
    setRawThought(p.raw);
  };

  // Quick Load Preset for Reconciler Sandbox
  const selectConflictPreset = (p: ConflictPreset) => {
    setSelectedPresetId(p.id);
    setReconcileTopic(p.topic);
    setMomView(p.momThought);
    setDaughterView(p.daughterThought);
    setReconcileResult(null);
    setPactRatified(false);
    setMomSigned(false);
    setDaughterSigned(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] p-3 md:p-6 text-[#4A3B34] transition-colors duration-300">
      
      {/* HEADER SECTION WITH HARMONY STATUS */}
      <header className="max-w-7xl mx-auto mb-6 bg-white/90 backdrop-blur-md rounded-[32px] p-4 md:p-6 border border-[#E8DCCF] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 bg-[#FF8C61] rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md">
            H
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-xl md:text-2xl font-serif font-bold italic tracking-tight text-[#4A3B34]">
                Mother-Daughter <span className="text-[#FF8C61]">Harmony Bridge</span>
              </h1>
              <span className="px-3 py-1 bg-[#E8DCCF] text-[#4A3B34] text-xs font-serif italic font-bold rounded-full border border-[#E8DCCF]/50 flex items-center gap-1">
                <Smile className="w-3 text-[#FF8C61]" /> Wellness Advocate Guard Active
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#4A3B34]/75 font-serif mt-0.5">
              HarmonyBridge • Using Generative AI to de-escalate generational friction, converting minor household disputes into warm, humorous bonding opportunities.
            </p>
          </div>
        </div>

        {/* Global Configuration & Meter Group */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Dynamic Daughter Age Configuration Dropdown */}
          <div className="flex items-center gap-2 bg-[#FDF8F4] border border-[#E8DCCF] py-2 px-3 rounded-2xl">
            <span className="text-xs font-serif font-bold text-[#4A3B34] whitespace-nowrap">
              👩‍🎓 Daughter's Age:
            </span>
            <select
              value={daughterAge}
              onChange={(e) => {
                const newAge = Number(e.target.value);
                setDaughterAge(newAge);
                // Load a default scenario matching this developmental stage automatically
                const matchingPre = PRESETS.find(p => p.stage === "both" || (newAge < 18 ? p.stage === "teen" : p.stage === "adult"));
                if (matchingPre) {
                  selectConflictPreset(matchingPre);
                }
              }}
              className="bg-white border border-[#E8DCCF] rounded-xl text-xs py-1 px-2.5 font-bold text-[#4A3B34] focus:outline-none focus:ring-1 focus:ring-[#FF8C61]"
            >
              {[14, 15, 16, 17, 18, 19, 20, 21, 22].map((a) => (
                <option key={a} value={a}>
                  {a} yrs old ({a < 18 ? "Teenager" : "Young Adult"})
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Meter / Harmony Index */}
          <div className="flex items-center gap-4 bg-[#FDF8F4] border border-[#E8DCCF] py-2 px-3 rounded-2xl shadow-sm flex-1 md:flex-none">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-serif font-bold italic text-[#4A3B34] tracking-wider uppercase block">
                  Generational Harmony Index
                </span>
                <span className="font-mono text-[9px] font-bold text-[#FF8C61] bg-[#FF8C61]/10 px-1.5 py-0.5 rounded-full">
                  +{harmonyScore - 65}% Improved
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 bg-[#E8DCCF] h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-[#FF8C61] h-1.5 rounded-full"
                    animate={{ width: `${harmonyScore}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="font-serif font-bold text-sm text-[#FF8C61]">
                  {harmonyScore}%
                </span>
              </div>
            </div>
            <div className="bg-[#4A3B34] text-white rounded-xl p-2 flex items-center justify-center shadow-md">
              <Activity className="w-4 h-4 text-[#FF8C61]" />
            </div>
          </div>
        </div>
      </header>

      {/* CORE NAVIGATION BAR */}
      <nav className="max-w-7xl mx-auto mb-6 flex flex-wrap bg-[#E8DCCF]/40 p-1 rounded-2xl border border-[#E8DCCF] max-w-md md:max-w-4xl gap-1 justify-center">
        <button
          onClick={() => setActiveTab("translate")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
            activeTab === "translate"
              ? "bg-[#4A3B34] text-[#FDF8F4] shadow-sm"
              : "text-[#4A3B34]/70 hover:text-[#4A3B34] hover:bg-white/40"
          }`}
        >
          <Smile className="w-4 h-4 text-[#FF8C61]" /> Empathy Translator
        </button>
        <button
          onClick={() => setActiveTab("reconcile")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
            activeTab === "reconcile"
              ? "bg-[#4A3B34] text-[#FDF8F4] shadow-sm"
              : "text-[#4A3B34]/70 hover:text-[#4A3B34] hover:bg-white/40"
          }`}
        >
          <FileText className="w-4 h-4 text-[#FF8C61]" /> Perspective Sandbox
        </button>
        <button
          onClick={() => setActiveTab("journal")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
            activeTab === "journal"
              ? "bg-[#4A3B34] text-[#FDF8F4] shadow-sm"
              : "text-[#4A3B34]/70 hover:text-[#4A3B34] hover:bg-white/40"
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#FF8C61]" /> Shared Wellness Journal
        </button>
        <button
          onClick={() => setActiveTab("presentation")}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
            activeTab === "presentation"
              ? "bg-[#4A3B34] text-[#FDF8F4] shadow-sm"
              : "text-[#4A3B34]/70 hover:text-[#4A3B34] hover:bg-white/40"
          }`}
        >
          <Presentation className="w-4 h-4 text-[#FF8C61]" /> Showcase Slide Deck
        </button>
      </nav>

      {/* WORKSPACE LAYOUT */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: PEACE EMOTION TRANSLATOR */}
        <AnimatePresence mode="wait">
          {activeTab === "translate" && (
            <motion.div 
              key="translate-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="col-span-12 lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Preset triggers & raw inputs */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 md:p-6 border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-[#FDF8F4] pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-[#FF8C61] w-5 h-5" />
                    <h2 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">
                      Step 1: Choose Your Role & Type Raw Thought
                    </h2>
                  </div>
                  <span className="text-xs text-[#4A3B34]/60 font-mono">Real-time Translator</span>
                </div>

                {/* Role Switch Panel */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => { setRole("mom"); setRawThought(""); }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                      role === "mom"
                        ? "border-[#FF8C61] bg-[#FF8C61]/10 text-[#FF8C61] ring-2 ring-[#FF8C61]/10 font-bold"
                        : "border-[#E8DCCF] hover:bg-[#FDF8F4] text-[#4A3B34]/80"
                    }`}
                  >
                    <span className="text-2xl">👩‍👦</span>
                    <span className="text-xs font-serif font-bold tracking-wider">I'm Mom</span>
                  </button>
                  <button
                    onClick={() => { setRole("daughter"); setRawThought(""); }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                      role === "daughter"
                        ? "border-[#4A3B34] bg-[#4A3B34]/10 text-[#4A3B34] ring-2 ring-[#4A3B34]/10 font-bold"
                        : "border-[#E8DCCF] hover:bg-[#FDF8F4] text-[#4A3B34]/80"
                    }`}
                  >
                    <span className="text-2xl">👩‍🎓</span>
                    <span className="text-xs font-serif font-bold tracking-wider">I'm Daughter ({daughterAge < 18 ? "Teenager" : "Young Adult"})</span>
                  </button>
                </div>

                {/* Preset helpers with dynamic developmental filtering */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    💡 【Time-saving Demo】Quick Presets ({daughterAge < 18 ? "Teenager Focus" : "Young Adult Focus"})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {THOUGHT_PRESETS.filter(p => p.role === role && (p.stage === "both" || (daughterAge < 18 ? p.stage === "teen" : p.stage === "adult"))).map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectThoughtPreset(p)}
                        className="text-xs bg-[#FDF8F4] hover:bg-[#E8DCCF] hover:text-[#4A3B34] text-[#4A3B34]/90 font-semibold px-2.5 py-1.5 rounded-lg border border-[#E8DCCF] cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom input layout */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-1 tracking-widest uppercase font-serif">
                    Type Your Raw Thought (With real unfiltered emotions)
                  </label>
                  <textarea
                    value={rawThought}
                    onChange={(e) => setRawThought(e.target.value)}
                    placeholder={
                      role === "mom"
                        ? "e.g., You stay on your phone until noon and never wash your clothes! You are wasting your potential and it drives me crazy!"
                        : "e.g., Stop tracking my location and spam-calling me every 15 minutes! Give me some autonomy and privacy!"
                    }
                    className="w-full h-32 p-3 bg-[#FDF8F4]/30 border border-[#E8DCCF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C61]/25 focus:border-[#FF8C61] font-sans leading-relaxed text-[#4A3B34]"
                  />
                  <div className="flex justify-end p-1 text-[10px] text-[#4A3B34]/50 font-mono">
                    {rawThought.length} chars
                  </div>
                </div>

                {/* Tone Vibe Selection */}
                <div className="mb-5">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    Select Converted Tone (Tone Vibe Selection):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => setVibe("warm")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                        vibe === "warm"
                          ? "bg-[#FF8C61]/15 text-[#FF8C61] border-[#FF8C61] ring-2 ring-[#FF8C61]/10"
                          : "bg-white border-[#E8DCCF] hover:border-[#FF8C61]/60 text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-lg">🌸</span>
                      <span className="font-serif italic font-bold">Warm & Empathetic</span>
                    </button>
                    <button
                      onClick={() => setVibe("humorous")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                        vibe === "humorous"
                          ? "bg-[#FF8C61]/15 text-[#FF8C61] border-[#FF8C61] ring-2 ring-[#FF8C61]/10"
                          : "bg-white border-[#E8DCCF] hover:border-[#FF8C61]/60 text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-lg">🎭</span>
                      <span className="font-serif italic font-bold">Playful & Humorous</span>
                    </button>
                    <button
                      onClick={() => setVibe("logical")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                        vibe === "logical"
                          ? "bg-[#4A3B34]/10 text-[#4A3B34] border-[#4A3B34] ring-2 ring-[#4A3B34]/5"
                          : "bg-white border-[#E8DCCF] hover:border-[#4A3B34]/65 text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-lg">👔</span>
                      <span className="font-serif italic font-bold">Logical & Analytical</span>
                    </button>
                    <button
                      onClick={() => setVibe("role_swap")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                        vibe === "role_swap"
                          ? "bg-[#4A3B34]/10 text-[#4A3B34] border-[#4A3B34] ring-2 ring-[#4A3B34]/5"
                          : "bg-white border-[#E8DCCF] hover:border-[#4A3B34]/65 text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-lg">🔄</span>
                      <span className="font-serif italic font-bold">Role Reversed</span>
                    </button>
                  </div>
                </div>

                {/* Translation Trigger */}
                <button
                  onClick={handleTranslate}
                  disabled={!rawThought.trim() || isTranslating}
                  className="w-full bg-[#FF8C61] hover:bg-[#ff7a47] text-white font-serif font-bold py-3.5 px-6 rounded-full shadow-lg shadow-[#FF8C61]/25 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  {isTranslating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gemini is analyzing family expectations and converting tone...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white" />
                      <span>Cool and Translate Sentiment</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Visualized interactive demo container */}
              <div className="lg:col-span-5 bg-white rounded-[40px] shadow-2xl border border-[#E8DCCF] overflow-hidden flex flex-col justify-between">
                
                {/* Result header */}
                <div className="bg-[#4A3B34] p-5 text-white flex justify-between items-center border-b border-[#E8DCCF]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#FF8C61] bg-[#E8DCCF] flex items-center justify-center text-[#4A3B34] font-serif font-bold text-sm">
                      {role === "mom" ? "Mom" : "Dau"}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm italic">AI Ice-Breaking Chamber</div>
                      <div className="text-[10px] opacity-60">Gemini 3.5-flash Neutralizer: Active</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">•••</div>
                </div>

                {/* Result body with gradient background */}
                <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 bg-gradient-to-b from-white to-[#FDF8F4] min-h-[460px]">
                  
                  {!translationResult && !isTranslating && (
                    <div className="text-center py-16 flex flex-col items-center justify-center h-full my-auto">
                      <div className="w-16 h-16 bg-[#FDF8F4] rounded-full border border-[#E8DCCF] flex items-center justify-center mb-4 text-[#FF8C61]">
                        <Smile className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-serif font-bold italic text-[#4A3B34]">
                        "Unfiltered thoughts spark high defensiveness and emotional fatigue."
                      </p>
                      <p className="text-xs text-[#4A3B34]/70 mt-2 max-w-xs leading-relaxed font-serif">
                        Type your raw feelings on the left. Gemini will de-escalate verbal friction, letting your underlying warmth and care shine through for constructive conversation.
                      </p>
                    </div>
                  )}

                  {isTranslating && (
                    <div className="py-20 text-center flex flex-col items-center justify-center h-full my-auto">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-[#FF8C61]/30 rounded-full animate-ping" />
                        <Heart className="w-8 h-8 text-[#FF8C61] absolute top-4 left-4 fill-[#FF8C61]" />
                      </div>
                      <p className="font-serif font-bold italic text-md text-[#4A3B34] animate-pulse">
                        [AI Empathy Buffer Active]
                      </p>
                      <p className="text-xs text-[#4A3B34]/70 mt-2 max-w-xs leading-relaxed font-serif">
                        Deconstructing verbal friction layers, extracting core concerns, and seeking a heartwarming reply structure...
                      </p>
                    </div>
                  )}

                  {translationResult && !isTranslating && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col justify-between h-full gap-5"
                    >
                      {/* Section 1: Converted output (Artistic bubble style) */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold text-[#FF8C61] tracking-widest font-serif">
                            ✨ Calmed Expressive Translation (What she sees)
                          </span>
                          <button 
                            onClick={() => copyToClipboard(translationResult.translatedText, "translated")}
                            className="text-[#4A3B34]/50 hover:text-[#FF8C61] transition"
                            title="Copy Translation"
                          >
                            {copiedText === "translated" ? <Check className="w-3.5 text-green-650 font-extrabold" /> : <Copy className="w-3.5" />}
                          </button>
                        </div>
                        <div className="bg-[#FF8C61] text-white p-5 rounded-3xl rounded-br-none shadow-lg shadow-[#FF8C61]/20">
                          <p className="text-sm md:text-md font-serif font-medium leading-relaxed">
                            “{translationResult.translatedText}”
                          </p>
                        </div>
                      </div>

                      {/* Section 2: Underlying need breakdown */}
                      <div className="bg-[#FDF8F4] p-4 rounded-3xl border border-[#E8DCCF] text-xs">
                        <h4 className="font-serif font-bold italic text-[#4A3B34] flex items-center gap-1 mb-1.5 uppercase tracking-wide">
                          🕵️‍♂️ Underlying Positive Intent & Concerns:
                        </h4>
                        <p className="text-[#4A3B34]/85 leading-relaxed">
                          {translationResult.underlyingConcern}
                        </p>
                      </div>

                      {/* Section 3: Proposed nice reply */}
                      <div className="bg-white p-4 rounded-3xl border border-[#E8DCCF] text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-serif font-bold italic text-[#FF8C61] flex items-center gap-1 uppercase tracking-wide">
                            💌 Tactful & Heartwarming Reply Templates:
                          </h4>
                          <button 
                            onClick={() => copyToClipboard(translationResult.replyOption, "reply")}
                            className="hover:text-[#4A3B34] transition text-gray-400"
                          >
                            {copiedText === "reply" ? <Check className="w-3.5 text-emerald-600" /> : <Copy className="w-3.5" />}
                          </button>
                        </div>
                        <p className="text-[#4A3B34]/80 italic border-l-2 border-[#FF8C61] pl-2 bg-[#FDF8F4]/30 p-2 rounded-r-md">
                          {translationResult.replyOption}
                        </p>
                      </div>

                      {/* Section 4: Physical Sweet Action */}
                      <div className="bg-[#E8DCCF]/40 p-3 rounded-2xl border border-[#E8DCCF] text-xs text-[#4A3B34]/90">
                        <span className="font-bold text-[#FF8C61] font-serif">🎁 【Bonus Peace Action Item】:</span> {translationResult.peaceBonusAction}
                      </div>

                      <button
                        onClick={() => {
                          setHarmonyScore(prev => Math.min(prev + 3, 100));
                          setTranslationResult(null);
                          setRawThought("");
                        }}
                        className="w-full bg-[#4A3B34] hover:bg-[#5c4940] text-white font-serif font-bold py-3 px-4 rounded-full text-xs uppercase tracking-widest transition shadow-md cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4 text-[#FF8C61]" />
                        <span>Accept Calm Translation (Harmony +3%)</span>
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Translation Feed History */}
                {translationHistory.length > 0 && (
                  <div className="bg-white border-t border-[#E8DCCF] p-4 max-h-48 overflow-y-auto">
                    <h4 className="text-[10px] font-bold text-[#4A3B34]/60 mb-2 uppercase tracking-widest font-serif block text-center">
                      📜 Generational Harmony Logs ({translationHistory.length})
                    </h4>
                    <div className="space-y-2">
                      {translationHistory.map((item, idx) => (
                        <div key={idx} className="bg-[#FDF8F4]/50 p-2.5 rounded-2xl text-xs leading-relaxed border border-[#E8DCCF]/50">
                          <div className="flex justify-between items-center mb-1 text-[10px] text-[#4A3B34]/50 font-mono">
                            <span className="font-bold">
                              {item.sender === "mom" ? "👩‍👦 Mom Said" : "👩‍🎓 Daughter Said"} • 【{item.vibe === "warm" ? "Warm" : "Humorous"}】
                            </span>
                            <span>{item.timestamp}</span>
                          </div>
                          <div className="text-red-400 line-through">Raw: {item.rawThought}</div>
                          <div className="text-[#4A3B34] font-bold mt-1 font-serif">Calmed: “{item.translatedText}”</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 2: PERSPECTIVE RECONCILIATION SANDBOX & TREATY */}
        <AnimatePresence mode="wait">
          {activeTab === "reconcile" && (
            <motion.div
              key="reconcile-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Presets and Viewpoints sandbox */}
              <div className="lg:col-span-7 bg-white rounded-[32px] p-5 md:p-6 border border-[#E8DCCF] shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-[#FDF8F4] pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="text-[#FF8C61] w-5 h-5" />
                    <h2 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">
                      Step 1: Choose or Describe Dispute to Draft Harmony Accord
                    </h2>
                  </div>
                  <span className="text-xs text-[#4A3B34]/60 font-mono">Mutual Agreement Sandbox</span>
                </div>

                {/* Preset Conflict selectors */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    🛎️ Select Typical Parent-Teen Conflict Scenarios (One-Click Setup):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => selectConflictPreset(p)}
                        className={`p-2.5 rounded-xl text-left text-xs border cursor-pointer transition-all ${
                          selectedPresetId === p.id
                            ? "bg-[#FF8C61]/15 text-[#FF8C61] border-[#FF8C61] ring-2 ring-[#FF8C61]/10 font-bold"
                            : "bg-[#FDF8F4]/30 border-[#E8DCCF] hover:bg-[#E8DCCF] text-[#4A3B34]"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 font-serif">
                          <span>{p.emoji}</span>
                          <span>{p.topic}</span>
                        </div>
                        <p className="text-[10px] text-[#4A3B34]/60 truncate mt-0.5">{p.topicEn}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conflict Topic Title */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-1 uppercase tracking-widest font-serif">
                    Current Dispute Subject:
                  </label>
                  <input
                    type="text"
                    value={reconcileTopic}
                    onChange={(e) => setReconcileTopic(e.target.value)}
                    className="w-full p-2.5 border border-[#E8DCCF] rounded-xl text-xs font-serif font-bold text-[#4A3B34] focus:outline-none focus:ring-2 focus:ring-[#FF8C61]/25 focus:border-[#FF8C61]"
                  />
                </div>

                {/* Side-by-Side Perspectives Viewport */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-[#FF8C61]/5 p-4 border border-[#FF8C61]/15 rounded-2xl">
                    <label className="text-xs font-serif font-bold text-[#FF8C61] block mb-1 flex items-center gap-1 justify-between">
                      <span>👩‍👦 Mom's Protective Concerns</span>
                      <span className="text-[10px] font-normal opacity-60">Mother's Protection</span>
                    </label>
                    <textarea
                      value={momView}
                      onChange={(e) => { setMomView(e.target.value); setSelectedPresetId(""); }}
                      placeholder="Describe Mom's perspective, expectations, and motherly protection worries..."
                      className="w-full h-36 p-3 bg-white border border-[#E8DCCF] rounded-xl text-xs text-[#4A3B34] focus:outline-none focus:ring-2 focus:ring-[#FF8C61]/25 focus:border-[#FF8C61]"
                    />
                  </div>
                  <div className="bg-[#4A3B34]/5 p-4 border border-[#4A3B34]/10 rounded-2xl">
                    <label className="text-xs font-serif font-bold text-[#4A3B34] block mb-1 flex items-center gap-1 justify-between">
                      <span>👩‍🎓 Daughter's Autonomy & Boundary Expectations</span>
                      <span className="text-[10px] font-normal opacity-60">Daughter's Autonomy</span>
                    </label>
                    <textarea
                      value={daughterView}
                      onChange={(e) => { setDaughterView(e.target.value); setSelectedPresetId(""); }}
                      placeholder="Describe Daughter's view, scheduling logic, and personal growth workspace needs..."
                      className="w-full h-36 p-3 bg-white border border-[#E8DCCF] rounded-xl text-xs text-[#4A3B34] focus:outline-none focus:ring-2 focus:ring-[#4A3B34]/25 focus:border-[#4A3B34]"
                    />
                  </div>
                </div>

                {/* Drafting Trigger CTA */}
                <button
                  onClick={handleReconcile}
                  disabled={!momView.trim() || !daughterView.trim() || isReconciling}
                  className="w-full bg-[#4A3B34] hover:bg-[#5c4940] text-white font-serif font-bold py-3.5 px-6 rounded-full shadow-lg shadow-[#4A3B34]/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-40"
                >
                  {isReconciling ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gemini is aligning baseline trust boundaries and drafting win-win treaty...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-[#FF8C61] text-[#FF8C61]" />
                      <span>Draft Dual-Sided Harmony Accord</span>
                    </>
                  )}
                </button>
              </div>

              {/* Legal treaty certificate workspace */}
              <div className="lg:col-span-5">
                <div className="bg-[#FCFAF7] border-4 border-double border-[#E8DCCF] bg-[radial-gradient(#E8DCCF_0.8px,transparent_0.8px)] [background-size:16px_16px] rounded-[32px] p-6 shadow-xl flex flex-col justify-between h-full min-h-[500px]">
                  
                  {!reconcileResult && !isReconciling && (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full my-auto">
                      <div className="w-16 h-16 bg-[#FDF8F4] rounded-full border border-[#E8DCCF] flex items-center justify-center mb-4 text-[#FF8C61]">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-serif font-bold italic text-[#4A3B34]">"Co-existence is a mutual alliance, not an opposition."</p>
                      <p className="text-xs text-[#4A3B34]/70 mt-2 max-w-xs leading-relaxed font-serif">
                        Should minor disputes escalate, engage the AI Mediator. Gemini will intersect your concerns, creating a heartwarming, highly practical bilateral Treaty Accord.
                      </p>
                    </div>
                  )}

                  {isReconciling && (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full my-auto animate-pulse">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-white border border-[#E8DCCF] rounded-full flex items-center justify-center animate-spin">
                          <RotateCcw className="w-8 h-8 text-[#FF8C61]" />
                        </div>
                      </div>
                      <p className="font-serif font-bold italic text-sm text-[#4A3B34]">
                        Aligning bilateral trust safety valves and boundaries...
                      </p>
                      <p className="text-[11px] text-[#4A3B34]/60 mt-2 max-w-xs leading-relaxed font-serif">
                        AI is softening verbal resistance, compiling sweet clauses for co-living harmony.
                      </p>
                    </div>
                  )}

                  {reconcileResult && !isReconciling && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col justify-between h-full gap-4"
                    >
                      {/* Top Header Pact */}
                      <div className="bg-[#4A3B34] text-[#FDF8F4] p-4 rounded-t-2xl border-b border-[#E8DCCF] text-center">
                        <span className="text-[10px] font-bold text-[#FF8C61] tracking-widest uppercase block mb-1 font-serif">
                          Bilateral Harmonious Peace Accord (Accords of Harmony)
                        </span>
                        <h3 className="text-md font-serif font-bold italic text-white leading-snug">
                          {reconcileResult.pactTitle}
                        </h3>
                      </div>

                      {/* Common values unified */}
                      <div className="bg-[#E8DCCF]/20 p-3 rounded-2xl border border-[#E8DCCF] text-xs">
                        <h4 className="font-serif font-bold text-[#4A3B34] flex items-center gap-1 mb-1">
                          🤝 Shared Foundation & Positive Concerns (Value Core):
                        </h4>
                        <p className="text-[#4A3B34]/90 leading-relaxed italic">
                          “{reconcileResult.commonalities}”
                        </p>
                      </div>

                      {/* Splitting rules */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#4A3B34]/60 uppercase tracking-widest font-serif block">
                          📜 Actionable Accord Clauses (Accord Articles)
                        </span>
                        {reconcileResult.pactArticles.map((art, index) => (
                          <div key={index} className="flex gap-2 items-start text-xs text-[#4A3B34]">
                            <span className="font-mono font-bold bg-[#E8DCCF]/50 px-1.5 py-0.5 rounded text-[#4A3B34]">
                              Art {index + 1}
                            </span>
                            <span className="leading-relaxed">{art}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mutual Compromises */}
                      <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E8DCCF] py-3">
                        <div>
                          <span className="font-serif font-bold text-[#FF8C61] block mb-0.5">👩‍👦 Mom's Warm Commitments:</span>
                          <p className="text-[#4A3B34]/85 leading-snug text-[11px]">{reconcileResult.momCompromise}</p>
                        </div>
                        <div className="border-l border-[#E8DCCF] pl-2.5">
                          <span className="font-serif font-bold text-[#4A3B34] block mb-0.5">👩‍🎓 Daughter's Kind Adjustments:</span>
                          <p className="text-[#4A3B34]/85 leading-snug text-[11px]">{reconcileResult.daughterCompromise}</p>
                        </div>
                      </div>

                      {/* Mini daily challenge game */}
                      <div className="bg-[#FF8C61]/10 p-2.5 rounded-2xl border border-[#FF8C61]/25 text-xs">
                        <span className="font-serif font-bold text-[#FF8C61]">🎲 Melt-the-Ice Co-activity Challenge:</span>
                        <p className="text-[#4A3B34]/90 text-[11px] mt-0.5">{reconcileResult.dailyChallenge}</p>
                      </div>

                      {/* Signature layout */}
                      {!pactRatified ? (
                        <div className="space-y-3 bg-white p-3 rounded-2xl border border-[#E8DCCF] mt-2 shadow-sm">
                          <span className="text-[10px] font-bold text-[#4A3B34]/70 block text-center uppercase tracking-widest font-serif">
                            ✒️ Sign to Ratify & Uphold
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={momSignName}
                              onChange={(e) => setMomSignName(e.target.value)}
                              placeholder="Mom's Digital Signature"
                              className="p-1.5 px-2 border border-[#E8DCCF] bg-[#FDF8F4]/30 rounded-xl text-xs text-[#4A3B34] focus:outline-none focus:ring-1 focus:ring-[#FF8C61] text-center font-serif italic"
                            />
                            <input
                              type="text"
                              value={daughterSignName}
                              onChange={(e) => setDaughterSignName(e.target.value)}
                              placeholder="Daughter's Digital Signature"
                              className="p-1.5 px-2 border border-[#E8DCCF] bg-[#FDF8F4]/30 rounded-xl text-xs text-[#4A3B34] focus:outline-none focus:ring-1 focus:ring-[#FF8C61] text-center font-serif italic"
                            />
                          </div>
                          <button
                            onClick={handleRatifyCurrentPact}
                            disabled={!momSignName.trim() || !daughterSignName.trim()}
                            className="w-full bg-[#4A3B34] hover:bg-[#5c4940] text-white font-serif font-bold py-2 px-3 rounded-full text-xs tracking-wider transition cursor-pointer disabled:opacity-40"
                          >
                            Ratify Accord & Activate Family Armor!
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-250 text-center mt-2 flex flex-col items-center justify-center gap-1">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="font-bold text-xs font-serif">Bilateral Accord Ratified! Generational friction dissolved.</span>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                            Signatures: {momSignName} ❤️ {daughterSignName} | Code: PACT-{Math.random().toString(36).substr(2, 5).toUpperCase()}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                </div>
              </div>

              {/* Bottom list showing signed treaties */}
              {pactList.length > 0 && (
                <div className="col-span-12 bg-white rounded-3xl p-5 border border-[#E8DCCF] shadow-sm">
                  <h4 className="text-xs font-bold text-[#4A3B34]/60 tracking-widest block mb-3 uppercase font-serif">
                    📁 Archives of Harmonious Treaties ({pactList.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {pactList.map((pact) => (
                      <div key={pact.id} className="bg-[#FDF8F4]/45 p-4 rounded-2xl border border-[#E8DCCF] flex flex-col justify-between text-xs shadow-sm">
                        <div>
                          <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-[#E8DCCF]/65">
                            <span className="font-serif font-bold text-[#4A3B34] truncate w-4/5 italic">{pact.pactTitle}</span>
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">Enforced</span>
                          </div>
                          <p className="text-[#4A3B34]/70 line-clamp-2 text-[11px] italic">“{pact.commonalities}”</p>
                          <div className="mt-2 space-y-1">
                            <div className="text-[10px] text-[#4A3B34]/85"><span className="font-serif font-bold text-[#FF8C61]">Mom's Commitments:</span> {pact.momCompromise}</div>
                            <div className="text-[10px] text-[#4A3B34]/85"><span className="font-serif font-bold text-[#4A3B34]">Daughter's Adjustments:</span> {pact.daughterCompromise}</div>
                          </div>
                        </div>
                        <div className="text-[9px] opacity-60 text-right mt-3 font-mono">
                          Date Ratified: {pact.signedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 3: SHARED HEALTH & WELLNESS JOURNAL */}
        <AnimatePresence mode="wait">
          {activeTab === "journal" && (
            <motion.div
              key="journal-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Daily Tracker Entry Form */}
              <div className="lg:col-span-6 bg-white rounded-[32px] p-5 md:p-6 border border-[#E8DCCF] shadow-sm">
                
                {/* Header title */}
                <div className="flex items-center justify-between mb-4 border-b border-[#FDF8F4] pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="text-[#FF8C61] w-5 h-5 animate-pulse" />
                    <h2 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">
                      Step 1: Record Today's Mother-Daughter Wellness Journal
                    </h2>
                  </div>
                  <span className="text-xs text-[#4A3B34]/60 font-mono">Shared Health Tracker</span>
                </div>

                {/* Info Note */}
                <p className="text-xs text-[#4A3B34]/80 leading-relaxed mb-4 bg-[#FDF8F4] p-3 rounded-2xl border border-[#E8DCCF]/50 font-serif">
                  🌿 <strong>Generational Wellness is Built on Mutual Awareness:</strong> Mom and Daughter log their daily sleep, nutrition, physical activity, and notes separately. As health logs sync, Gemini finds hidden healthy alignments and suggests fun co-healing activities, keeping parent-daughter mental and physical status in pristine harmony.
                </p>

                {/* Form Role Selector */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    🧑‍🤝‍🧑 Switch Logger Character:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setJournalRole("mom");
                        setJournalNotes("");
                        setJournalMood("😌 Peaceful & Warm");
                        setJournalMoodEn("peaceful");
                        setSelectedActivities([]);
                      }}
                      className={`py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                        journalRole === "mom"
                          ? "border-[#FF8C61] bg-[#FF8C61]/10 text-[#FF8C61] ring-2 ring-[#FF8C61]/10 font-bold"
                          : "border-[#E8DCCF] hover:bg-[#FDF8F4] text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-xl">👩‍👦</span>
                      <span className="text-xs font-serif font-bold font-semibold uppercase tracking-wider text-[11px]">Mom's Active Wellness</span>
                    </button>
                    <button
                      onClick={() => {
                        setJournalRole("daughter");
                        setJournalNotes("");
                        setJournalMood("😌 Peaceful & Warm");
                        setJournalMoodEn("peaceful");
                        setSelectedActivities([]);
                      }}
                      className={`py-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer ${
                        journalRole === "daughter"
                          ? "border-[#4A3B34] bg-[#4A3B34]/10 text-[#4A3B34] ring-2 ring-[#4A3B34]/10 font-bold"
                          : "border-[#E8DCCF] hover:bg-[#FDF8F4] text-[#4A3B34]/80"
                      }`}
                    >
                      <span className="text-xl">👩‍🎓</span>
                      <span className="text-xs font-serif font-bold font-semibold uppercase tracking-wider text-[11px]">Daughter's Energy Recharge</span>
                    </button>
                  </div>
                </div>

                {/* Presets shortcut trigger panel for demo time */}
                <div className="mb-4 bg-[#FDF8F4]/40 p-3 rounded-2xl border border-[#E8DCCF]/40">
                  <label className="text-[10px] font-bold text-[#4A3B34]/70 block mb-2 tracking-wider font-serif uppercase">
                    💡 [Quick Demo] One-Click Auto-Load Mother/Daughter Daily Log Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {JOURNAL_PRESETS.filter(p => p.sender === journalRole).map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLoadJournalPreset(p)}
                        className="text-[11px] bg-[#FDF8F4] hover:bg-[#E8DCCF] hover:text-[#4A3B34] text-[#4A3B34]/90 px-2.5 py-1.5 rounded-lg border border-[#E8DCCF] cursor-pointer font-serif tracking-tight font-semibold"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood picker */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    🎭 Select Today's Mood & State:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {JOURNAL_MOODS.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setJournalMood(m.label);
                          setJournalMoodEn(m.en);
                        }}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          journalMood === m.label
                            ? "bg-[#4A3B34] text-white border-[#4A3B34] font-bold shadow-sm animate-pulse"
                            : "bg-white hover:bg-[#FDF8F4] text-[#4A3B34] border-[#E8DCCF]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Habit checkoff box */}
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-2 tracking-widest uppercase font-serif">
                    ✔️ Check Daily Habits Completed:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(journalRole === "mom" ? MOM_ACTIVITIES : DAUGHTER_ACTIVITIES).map((act, idx) => {
                      const isSelected = selectedActivities.includes(act);
                      return (
                        <button
                          key={idx}
                          role="checkbox"
                          aria-checked={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedActivities(prev => prev.filter(x => x !== act));
                            } else {
                              setSelectedActivities(prev => [...prev, act]);
                            }
                          }}
                          className={`p-2 rounded-xl text-left text-xs border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-[#FF8C61]/15 text-[#FF8C61] border-[#FF8C61] font-bold"
                              : "bg-[#FDF8F4]/20 text-[#4A3B34]/90 border-[#E8DCCF] hover:bg-[#FDF8F4]"
                          }`}
                        >
                          <span className="truncate">{act}</span>
                          <span className={`text-[10px] font-bold ${isSelected ? "text-[#FF8C61]" : "text-gray-300"}`}>
                            {isSelected ? "●" : "○"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Notes input */}
                <div className="mb-5">
                  <label className="text-[10px] font-bold text-[#4A3B34]/60 block mb-1 uppercase tracking-widest font-serif">
                    Daily body awareness, healthy vibes, or a cute secret message to her:
                  </label>
                  <textarea
                    value={journalNotes}
                    onChange={(e) => setJournalNotes(e.target.value)}
                    placeholder={
                      journalRole === "mom"
                        ? "e.g. Took a warm foot bath and got sleepy by 10 PM. Sent you a helpful health quick-tip on chat today, please check it out, sweetie..."
                        : "e.g. Studied at the library for hours and my neck is a bit stiff, but drank 2 liters of water! No spicy fried food today, proud of myself..."
                    }
                    className="w-full h-24 p-3 border border-[#E8DCCF] rounded-xl text-xs text-[#4A3B34] focus:outline-none focus:ring-2 focus:ring-[#FF8C61]/25 focus:border-[#FF8C61] placeholder-[#4A3B34]/40"
                  />
                </div>

                {/* Publish Button */}
                <button
                  onClick={handleAddJournalEntry}
                  disabled={selectedActivities.length === 0 && !journalNotes.trim()}
                  className="w-full bg-[#4A3B34] hover:bg-[#5c4940] text-white font-serif font-bold py-3 px-6 rounded-full shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-xs disabled:opacity-40"
                >
                  <CheckCircle className="w-4 h-4 text-[#FF8C61]" />
                  <span>Publish Today's Entry to Family Timeline</span>
                </button>
              </div>

              {/* Shared Brain & Feed Timeline */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                
                {/* AI Shared Brain Card */}
                <div className="bg-[#FCFAF7] border-4 border-double border-[#E8DCCF] bg-[radial-gradient(#E8DCCF_0.8px,transparent_0.8px)] [background-size:16px_16px] rounded-[32px] p-5 shadow-lg flex flex-col justify-between">
                  
                  <div>
                    <div className="text-center border-b border-[#E8DCCF]/70 pb-3.5 mb-4">
                      <span className="text-[10px] font-bold text-[#FF8C61] tracking-widest uppercase block mb-1 font-serif">
                        GEMINI CO-WELLNESS SYNERGY BRAIN
                      </span>
                      <h3 className="text-md font-serif font-bold italic text-[#4A3B34] leading-snug flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4 text-[#FF8C61] animate-spin" />
                        Generational Harmony & Health Co-Advisor
                      </h3>
                    </div>

                    {!journalInsight && !isAnalyzingJournal && (
                      <div className="text-center py-6 flex flex-col items-center justify-center">
                        <p className="text-xs text-[#4A3B34]/85 leading-relaxed font-serif max-w-sm mb-4">
                          Let AI act as a gentle breeze. Ditch direct confrontation and nagging—simply log your wellness habits separately. Click the analyze button below to let Gemini identify underlying synergies and align shared healing goals.
                        </p>
                        
                        {/* Interactive Status Indicator bar */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm bg-white p-3 rounded-2xl border border-[#E8DCCF] mb-4">
                          <div className="text-center">
                            <span className="text-[9px] text-[#4A3B34]/60 block font-serif uppercase">Shared Harmony Score:</span>
                            <span className="text-lg font-mono font-bold text-[#FF8C61] flex items-center justify-center gap-1">
                              <Award className="w-4.5 h-4.5 animate-bounce" />
                              {coopPoints} pts
                            </span>
                          </div>
                          <div className="text-center border-l border-[#E8DCCF]">
                            <span className="text-[9px] text-[#4A3B34]/60 block font-serif uppercase">Daily Habit Streak:</span>
                            <span className="text-lg font-mono font-bold text-[#4A3B34] flex items-center justify-center gap-1">
                              <Flame className="w-4.5 h-4.5 text-[#FF8C61]" />
                              {wellnessStreak} days
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {isAnalyzingJournal && (
                      <div className="text-center py-12 flex flex-col items-center justify-center animate-pulse">
                        <div className="relative mb-5">
                          <div className="w-12 h-12 bg-white border border-[#E8DCCF] rounded-full flex items-center justify-center animate-spin">
                            <RotateCcw className="w-6 h-6 text-[#FF8C61]" />
                          </div>
                        </div>
                        <p className="font-serif font-bold italic text-xs text-[#4A3B34]">
                          Interlocking biological signals and daily routines...
                        </p>
                        <p className="text-[10px] text-[#4A3B34]/60 mt-1 max-w-xs leading-relaxed font-serif">
                          Gemini is digesting your wellness histories to unlock sweet behavioral alignments and dissolve generational friction.
                        </p>
                      </div>
                    )}

                    {journalInsight && !isAnalyzingJournal && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        {/* Insight Synthed */}
                        <div className="bg-[#FF8C61]/5 p-3 rounded-2xl border border-[#FF8C61]/15 text-xs">
                          <h4 className="font-serif font-bold text-[#FF8C61] flex items-center gap-1 mb-1">
                            🌿 Generational Wellness Insight (Co-Wellness Insight):
                          </h4>
                          <p className="text-[#4A3B34]/90 font-serif leading-relaxed italic text-[11px]">
                            {journalInsight.wellnessSummary}
                          </p>
                        </div>

                        {/* Prescribed Goals */}
                        <div className="bg-white p-3 rounded-2xl border border-[#E8DCCF] text-xs">
                          <h4 className="font-serif font-bold text-[#4A3B34] mb-1.5 flex items-center gap-1">
                            📌 Shared Family Action Commitments (Shared Health Goals):
                          </h4>
                          <div className="space-y-1.5">
                            {journalInsight.sharedGoals.map((g, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#4A3B34]/90 leading-relaxed font-serif">
                                <span className="text-[#FF8C61] font-bold">✓</span>
                                <span>{g}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Activity Highlight */}
                        <div className="bg-gradient-to-br from-[#4A3B34] to-[#2B211E] text-[#FDF8F4] p-3.5 rounded-2xl shadow-sm border border-white/5 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono bg-[#FF8C61] text-white px-1.5 py-0.5 rounded-md font-bold uppercase">
                              🎮 CO-WELLNESS HARMONY CHALLENGE
                            </span>
                            <span className="text-[#FF8C61] font-mono font-bold">+{journalInsight.jointActivityProposal.happinessPoints} XP</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-white">
                            🎁 {journalInsight.jointActivityProposal.activityTitle}
                          </h4>
                          <p className="text-[11px] text-[#E8DCCF]/85 leading-relaxed font-serif font-semibold italic">
                            “ {journalInsight.jointActivityProposal.suggestedSetup} ”
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                setCoopPoints(prev => prev + 50);
                                setHarmonyScore(prev => Math.min(prev + 5, 100));
                                setWellnessStreak(prev => prev + 1);
                                alert("🎉 Completed this joint harmony challenge together! Generational harmony is blooming!");
                              }}
                              className="w-full bg-[#FF8C61] hover:bg-[#e4764d] text-[#FDF8F4] font-serif font-bold py-2 px-3 rounded-full text-[10px] tracking-wider uppercase transition cursor-pointer text-center block"
                            >
                              Challenge Complete: We hand-in-hand completed this!
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    )}

                  </div>

                  {/* Analyzer actions tab */}
                  <div className="border-t border-[#E8DCCF]/60 pt-3.5 mt-4">
                    <button
                      onClick={handleFetchJournalInsight}
                      disabled={journalEntries.length < 2 || isAnalyzingJournal}
                      className="w-full bg-[#4A3B34] hover:bg-[#5c4940] text-white font-serif font-bold py-3 px-4 rounded-full text-xs uppercase tracking-widest transition shadow-md cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#FF8C61]" />
                      <span>{journalEntries.length < 2 ? "Log at least one entry for BOTH Mom and Daughter to activate AI Health analysis" : "🔮 Sync Routines & Reveal Mutual Co-Wellness Plan"}</span>
                    </button>
                  </div>

                </div>

                {/* Journal Feed Timeline lists */}
                <div className="bg-white rounded-[32px] p-5 border border-[#E8DCCF] shadow-sm flex-1 min-h-[300px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#FDF8F4]">
                      <h4 className="text-xs font-bold text-[#4A3B34]/60 tracking-wider font-serif uppercase">
                        📅 Generational Wellness Timeline (Family Timeline Feed)
                      </h4>
                      <button
                        onClick={() => {
                          setJournalEntries([]);
                          setJournalInsight(null);
                          setWellnessStreak(0);
                        }}
                        className="text-[10px] text-red-500 hover:underline cursor-pointer font-serif font-semibold"
                      >
                        Clear Timeline
                      </button>
                    </div>

                    {journalEntries.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center justify-center">
                        <p className="text-xs text-[#4A3B34]/60 font-serif">
                          Timeline is empty. Click presets on the left for quick demo or write custom entries as Mom/Daughter to begin!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        {journalEntries.map((entry) => {
                          const isMom = entry.sender === "mom";
                          return (
                            <div 
                              key={entry.id} 
                              className={`p-3 rounded-2xl border transition-all text-xs flex flex-col gap-1.5 shadow-xs ${
                                isMom 
                                  ? "bg-[#FF8C61]/5 border-[#FF8C61]/15" 
                                  : "bg-[#4A3B34]/5 border-[#4A3B34]/10"
                              }`}
                            >
                              <div className="flex justify-between items-center text-[10px] text-[#4A3B34]/50 font-mono">
                                <span className={`font-serif font-bold text-xs ${isMom ? "text-[#FF8C61]" : "text-[#4A3B34]"}`}>
                                  {isMom ? "👩‍👦 Mom's Wellness Journal" : "👩‍🎓 Daughter's Energy Log"}
                                </span>
                                <span>{entry.timestamp}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="bg-white px-2 py-0.5 rounded-full border text-[10px] font-bold text-[#4A3B34]/80">
                                  State: {entry.mood}
                                </span>
                              </div>

                              {entry.activities && entry.activities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {entry.activities.map((act, i) => (
                                    <span 
                                      key={i} 
                                      className="text-[9px] bg-white/70 px-2 py-0.5 rounded-full border border-gray-100 font-serif text-[#4A3B34]/90"
                                    >
                                      ✓ {act}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {entry.notes && (
                                <p className="text-[#4A3B34]/90 font-serif bg-white/60 p-2.5 rounded-xl text-[11px] leading-relaxed italic border border-white">
                                  “ {entry.notes} ”
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-center text-[#4A3B34]/50 font-serif pt-3 border-t border-[#FDF8F4]">
                    💡 Tip: Mom logs mindful adjustments, Daughter reviews energy habits. Real-time logging builds mutual understanding, removing unnecessary friction.
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 4: HACKATHON ROUTESHIP presentation */}
        <AnimatePresence mode="wait">
          {activeTab === "presentation" && (
            <motion.div
              key="presentation-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="col-span-12"
            >
              <div className="bg-[#4A3B34] border border-[#E8DCCF] rounded-[32px] p-6 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 pointer-events-none font-serif font-extrabold italic">
                  DEEPMIND SPRINT
                </div>

                {/* SLIDE DECK TITLE HEADER */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-white">
                       <span>🏆 Google DeepMind AI Sprint Hackathon</span>
                    </h2>
                    <p className="text-[#dec2b3] text-xs font-serif font-sans mt-1">Mother-Daughter Generational Harmony & Empathy Shield Pitch Deck (1-Hour Challenge)</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10">
                    <span className="text-[10px] text-white/50 font-serif mr-1">SLIDES:</span>
                    {[0, 1, 2, 3].map((s) => (
                      <button
                        key={s}
                        onClick={() => setDeckStep(s)}
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition cursor-pointer ${
                          deckStep === s
                            ? "bg-[#FF8C61] text-[#4A3B34] scale-110"
                            : "bg-white/10 text-white/85 hover:bg-white/25"
                        }`}
                      >
                        {s + 1}
                      </button>
                    ))}
                    <span className="w-[1px] h-3.5 bg-white/20 mx-1"></span>
                    <button
                      onClick={() => setDeckStep(4)}
                      className={`px-3 py-1 rounded-full text-[10px] font-serif font-bold flex items-center gap-1 transition cursor-pointer ${
                        deckStep === 4
                          ? "bg-[#FF8C61] text-[#4A3B34]"
                          : "bg-white/15 text-[#FF8C61] border border-[#FF8C61]/35 hover:bg-white/25"
                      }`}
                    >
                      🎥 Pitch Video
                    </button>
                  </div>
                </div>

                <div className="bg-[#FDF8F4] rounded-2xl p-5 md:p-6 text-[#4A3B34] shadow-inner border border-white/40 relative min-h-[320px] flex flex-col justify-between">
                  <div className="flex-1">
                    {deckStep === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          <div className="lg:col-span-7 space-y-3">
                            <span className="text-xs bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-full font-bold font-serif">
                              Pain Point Breakdown
                            </span>
                            <h3 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">The Invisible Generational Friction Under Mutual Love</h3>
                            
                            <div className="space-y-2 text-xs text-[#4A3B34]/85 leading-relaxed font-serif font-semibold">
                              <p>
                                🚩 <strong className="text-[#4A3B34]">Love and Micro-Frictions:</strong> Mom and daughter share an intensely deep bond, but minor differences in daily routines, personal schedules, and boundary expectations often trigger unnecessary anxiety. Daily protective concern is easily miscategorized as nagging or control, driving high emotional exhaustion.
                              </p>
                              <p>
                                🚩 <strong className="text-[#4A3B34]">Cumulative Emotional Fatigue:</strong> Repeated small arguments and high emotional defenses quietly wear out the family's physiological and psychological safety space, leading to hidden generational exhaustion.
                              </p>
                              <p>
                                🚩 <strong className="text-[#4A3B34]">Missing Communication Buffer:</strong> Direct face-to-face confrontations easily spiral into endless self-defense in complex arguments. High-trust families require an elegant, low-friction, non-confrontational aesthetic buffer.
                              </p>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="w-full h-[180px] lg:h-[220px] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm bg-white p-1">
                              <img 
                                src="/src/assets/images/slide_one_problem_1780715852366.png" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                                alt="Slide 1 Illustration"
                              />
                            </div>
                            <span className="text-[9px] font-mono text-[#4A3B34]/55 mt-1">Plate 1: Generational Distance & Tension Ring</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#E8DCCF]/30 p-2.5 rounded-xl border border-[#E8DCCF] text-[11px] text-[#4A3B34]/90 italic font-serif">
                          💡 <strong>Pitch Speech Cue:</strong> "Behind generational differences, parental protective worries translate into minor daily friction, draining our families' emotional batteries. Our app acts as a beautiful, low-pressure aesthetic filter to protect their emotional futures."
                        </div>
                      </motion.div>
                    )}

                    {deckStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          <div className="lg:col-span-7 space-y-3">
                            <span className="text-xs bg-[#FF8C61]/15 text-[#FF8C61] border border-[#FF8C61]/25 px-2 py-0.5 rounded-full font-bold font-serif">
                              Gemini Empathy Architecture
                            </span>
                            <h3 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">Dual-Empathy Engine powered by Gemini 3.5-flash</h3>
                            
                            <div className="space-y-2 text-xs text-[#4A3B34]/85 leading-relaxed font-serif font-semibold">
                              <p>
                                🛡️ <strong className="text-[#4A3B34]">1. Tension Dissolver (Expressive Filter):</strong> When blunt, stressed, or argumentative input occurs, Gemini de-escalates verbal fire, translating raw thoughts into humorous, gentle, or highly tactile English expressions.
                              </p>
                              <p>
                                🛡️ <strong className="text-[#4A3B34]">2. Accord Alignment (Harmony Treaties):</strong> Air out conflicting viewpoints side-by-side. The AI maps common ground boundaries to draft win-win home treaties with digital signing checks.
                              </p>
                              <p>
                                🛡️ <strong className="text-[#4A3B34]">3. Quiet Habit Sync (Behavioral Insights):</strong> Quietly records sleep and daily habits. The backend structures wellness data to reveal synergistic patterns and joint harmony tasks via secure JSON schemas.
                              </p>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="w-full h-[180px] lg:h-[220px] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm bg-white p-1">
                              <img 
                                src="/src/assets/images/slide_two_solution_1780715870365.png" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                                alt="Slide 2 Illustration"
                              />
                            </div>
                            <span className="text-[9px] font-mono text-[#4A3B34]/55 mt-1">Plate 2: The Empathy Shield Conversion Engine</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#E8DCCF]/30 p-2.5 rounded-xl border border-[#E8DCCF] text-[11px] text-[#4A3B34]/90 italic font-serif">
                          💡 <strong>Pitch Speech Cue:</strong> "Utilizing server-side Gemini endpoints, we dissolve conversational friction, structure bilateral household rules, and systematically synthesize joint wellness targets to turn generational friction into mutual growth."
                        </div>
                      </motion.div>
                    )}

                    {deckStep === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          <div className="lg:col-span-7 space-y-3">
                            <span className="text-xs bg-[#4A3B34]/10 text-[#4A3B34] border border-[#4A3B34]/20 px-2 py-0.5 rounded-full font-bold font-serif">
                              Interactive Live Walkthrough
                            </span>
                            <h3 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">1-Minute Outstanding Live Demo Strategy</h3>
                            
                            <div className="grid grid-cols-3 gap-2 text-xs text-[#4A3B34] font-serif font-semibold font-sans font-medium">
                              <div className="bg-[#FF8C61]/5 p-2 rounded-xl border border-[#FF8C61]/15 leading-tight">
                                <span className="text-[#FF8C61] font-bold font-serif block mb-1 text-[10px]">A. Tone Translation</span>
                                <ol className="list-decimal list-inside space-y-0.5 text-[9px] opacity-90 leading-normal font-sans font-normal">
                                  <li>Select Mom perspective.</li>
                                  <li>Pick marriage nag preset.</li>
                                  <li>Convert with custom style.</li>
                                </ol>
                              </div>
                              <div className="bg-[#4A3B34]/5 p-2 rounded-xl border border-[#4A3B34]/10 leading-tight">
                                <span className="text-[#4A3B34] font-bold font-serif block mb-1 text-[10px]">B. Harmony Accord</span>
                                <ol className="list-decimal list-inside space-y-0.5 text-[9px] opacity-90 leading-normal font-sans font-normal">
                                  <li>Open Accords Tab.</li>
                                  <li>Click Home Chores setup.</li>
                                  <li>Draft & sign family treaty.</li>
                                </ol>
                              </div>
                              <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-150 leading-tight">
                                <span className="text-emerald-700 font-bold font-serif block mb-1 text-[10px]">C. Wellness Journal</span>
                                <ol className="list-decimal list-inside space-y-0.5 text-[9px] opacity-90 leading-normal font-sans font-normal">
                                  <li>Open Journal tracker.</li>
                                  <li>Quick-set role presets.</li>
                                  <li>Get health sync challenges.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="w-full h-[180px] lg:h-[220px] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm bg-white p-1">
                              <img 
                                src="/src/assets/images/slide_three_walkthrough_1780715883822.png" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                                alt="Slide 3 Illustration"
                              />
                            </div>
                            <span className="text-[9px] font-mono text-[#4A3B34]/55 mt-1">Plate 3: Non-Confounding Bilateral Agreement Flow</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#E8DCCF]/30 p-2.5 rounded-xl border border-[#E8DCCF] text-[11px] text-[#4A3B34]/90 italic font-serif">
                          💡 <strong>Pitch Speech Cue:</strong> "In under one minute, we showcase three powerful interactive layers of healing. Watch generational tension soften in real-time, aligning home compromises instantly."
                        </div>
                      </motion.div>
                    )}

                    {deckStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          <div className="lg:col-span-7 space-y-3">
                            <span className="text-xs bg-emerald-55 text-emerald-800 border-emerald-250 px-2.5 py-0.5 rounded-full font-bold font-serif">
                              Value & Scale • Social & Commercial Impact
                            </span>
                            <h3 className="text-md md:text-lg font-serif font-bold italic text-[#4A3B34]">Preventing emotional attrition, shielding highly sensitive homes</h3>
                            
                            <div className="space-y-2 text-xs text-[#4A3B34]/85 leading-relaxed font-serif font-semibold">
                              <p>
                                📊 <strong className="text-[#4A3B34]">Primary Target Group:</strong> Hundreds of millions of university students, young daughters transitioning to independent lives, hometown mothers, and highly sensitive households experiencing developmental boundary shifts.
                              </p>
                              <p>
                                📊 <strong className="text-[#4A3B34]">Commercial Horizons:</strong> 1. Dynamic integration with university psychological counseling SaaS. 2. Physical healing kits, cards, and daily home boards. 3. Escalating specialized "Cooling Chambers" for romantic domestic issues or corporate team friction.
                              </p>
                              <p>
                                📊 <strong className="text-[#4A3B34]">Proactive Safety Shield:</strong> Turns passive mental clinical treatment into proactive, daily aesthetic de-escalation, ensuring our loved ones enjoy respiratory flexibility and a long-term trust ecosystem.
                              </p>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="w-full h-[180px] lg:h-[220px] rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-sm bg-white p-1">
                              <img 
                                src="/src/assets/images/slide_four_impact_1780715896806.png" 
                                className="w-full h-full object-cover rounded-xl"
                                referrerPolicy="no-referrer"
                                alt="Slide 4 Illustration"
                              />
                            </div>
                            <span className="text-[9px] font-mono text-[#4A3B34]/55 mt-1">Plate 4: Spreading Organic Generational Wellness Globally</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#E8DCCF]/30 p-2.5 rounded-xl border border-[#E8DCCF] text-[11px] text-[#4A3B34]/90 italic font-serif">
                          💡 <strong>Pitch Speech Cue:</strong> "This is more than a simple web toy; it is structural, preventative wellness infrastructure. By turning familial defense loops into shared aesthetic acts of care, we safeguard family futures."
                        </div>
                      </motion.div>
                    )}

                    {deckStep === 4 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <span className="text-xs bg-[#FF8C61]/15 text-[#FF8C61] border border-[#FF8C61]/25 px-2.5 py-1 rounded-full font-bold font-serif uppercase tracking-wider">
                          🎥 Hackathon Pitch Video & Interactive Simulator
                        </span>
                        <div className="flex flex-col xl:flex-row justify-between items-start gap-1">
                          <h3 className="text-lg font-serif font-bold italic text-[#4A3B34]">Embedded Recording & Live-Ticker Teleprompter</h3>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            AI Co-Wellness Active Presenter Built-in
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Left column: Video player or Interactive Simulation (7 cols) */}
                          <div className="lg:col-span-7 flex flex-col gap-3">
                            <div className="bg-[#4A3B34] rounded-3xl border border-[#4A3B34] overflow-hidden flex flex-col justify-between relative shadow-lg min-h-[340px]">
                              
                              {demoVideoUrl ? (
                                <div className="w-full h-[300px] relative bg-black">
                                  <iframe
                                    src={(() => {
                                      let raw = demoVideoUrl.trim();
                                      if (raw.includes("youtube.com/watch")) {
                                        const v = new URL(raw).searchParams.get("v");
                                        if (v) return `https://www.youtube.com/embed/${v}`;
                                      } else if (raw.includes("youtu.be/")) {
                                        return `https://www.youtube.com/embed/${raw.split("youtu.be/")[1].split("?")[0]}`;
                                      } else if (raw.includes("loom.com/share/")) {
                                        return `https://www.loom.com/embed/${raw.split("loom.com/share/")[1].split("?")[0]}`;
                                      }
                                      return raw;
                                    })()}
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                /* Interactive Pitch Simulator Screen */
                                <div className="p-5 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#2B211E] to-[#1C1614] text-white overflow-hidden select-none">
                                  {/* Top visual bar */}
                                  <div className="flex justify-between items-center text-[10px] text-white/50 border-b border-white/10 pb-2">
                                    <span className="flex items-center gap-1.5 font-mono">
                                      <Tv className="w-3.5 h-3.5 text-[#FF8C61]" />
                                      2-MIN PRESENTATION LIVE SIMULATOR
                                    </span>
                                    <span className="font-mono bg-[#FF8C61]/20 text-[#FF8C61] border border-[#FF8C61]/35 px-2 py-0.5 rounded-full font-bold">
                                      {Math.floor(simTime / 60)}:{String(simTime % 60).padStart(2, "0")} / 2:00
                                    </span>
                                  </div>

                                  {/* Centered Graphic Area: Switched by simTime */}
                                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center z-10">
                                    <AnimatePresence mode="wait">
                                      {/* Stage 1: Problem (0s - 20s) */}
                                      {simTime >= 0 && simTime < 20 && (
                                        <motion.div
                                          key="problem_sim"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="space-y-2.5 max-w-sm"
                                        >
                                          <div className="relative inline-block">
                                            <span className="text-4xl">💔</span>
                                            <span className="absolute -top-1 -right-1 text-xs animate-bounce">⚡</span>
                                          </div>
                                          <h4 className="text-sm font-serif font-bold text-[#FF8C61]">
                                            Scene 1: The Invisible Generational Stress (0s - 20s)
                                          </h4>
                                          <p className="text-[11px] text-white/75 leading-relaxed font-serif">
                                            Loving motherly protectiveness is perceived as intrusive nagging. High-sensitivity structures fall silent, causing mutual emotional battery drainage.
                                          </p>
                                          {/* Animated separation lines */}
                                          <div className="flex justify-center items-center gap-6 pt-1">
                                            <span className="text-xs bg-white/5 px-2 py-1 rounded font-serif text-white/60">👩‍👦 Mom (Silent Anxiety)</span>
                                            <span className="text-red-400 font-mono text-[10px] animate-pulse">✖ Conflict ✖</span>
                                            <span className="text-xs bg-white/5 px-2 py-1 rounded font-serif text-white/60">👩‍🎓 Daughter (Friction)</span>
                                          </div>
                                        </motion.div>
                                      )}

                                      {/* Stage 2: Solution (20s - 40s) */}
                                      {simTime >= 20 && simTime < 40 && (
                                        <motion.div
                                          key="sol_sim"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="space-y-2.5 max-w-sm"
                                        >
                                          <div className="relative inline-block">
                                            <Sparkles className="w-10 h-10 text-[#FF8C61] animate-spin" />
                                          </div>
                                          <h4 className="text-sm font-serif font-bold text-[#FF8C61]">
                                            Scene 2: Dual Empathy Gemini Core (20s - 40s)
                                          </h4>
                                          <p className="text-[11px] text-white/75 leading-relaxed font-serif">
                                            We introduce a server-side Gemini 3.5-Flash filtering buffer. Raw words are structured with empathy, de-escalating domestic tensions into co-healing alignment.
                                          </p>
                                          <div className="flex justify-center items-center gap-4 text-xs font-mono font-bold text-[#FF8C61]">
                                            <span>Mothers Daily Concerns</span>
                                            <span>➡️ [Gemini Smart Core] ➡️</span>
                                            <span className="text-green-400">Empathy-Driven Grace</span>
                                          </div>
                                        </motion.div>
                                      )}

                                      {/* Stage 3: Walkthrough (40s - 100s) */}
                                      {simTime >= 40 && simTime < 100 && (
                                        <motion.div
                                          key="walk_sim"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="space-y-2.5 w-full max-w-md bg-white/5 p-4 rounded-2xl border border-white/15"
                                        >
                                          <div className="flex items-center justify-between text-[9px] font-mono border-b border-white/10 pb-1.5 text-white/40">
                                            <span>🔴 LIVE WALKTHROUGH SIMULATOR</span>
                                            <span className="text-[#FF8C61] animate-pulse">ACTIVE FLOW SEQUENCE</span>
                                          </div>

                                          {/* Sub-sequence changes */}
                                          {simTime >= 40 && simTime < 60 && (
                                            <div className="space-y-1.5 text-left animate-fade-in">
                                              <span className="text-[10px] font-mono text-white/60 uppercase text-[#FF8C61] block font-bold">Part A: Tension De-Escalator (Tone Shift)</span>
                                              <div className="bg-red-950/40 p-2 rounded-xl text-[10px] border border-red-900/35 leading-normal">
                                                <span className="text-red-400 font-bold font-serif block text-[9px]">Mom typed:</span>
                                                "Why aren't you dating yet? All my friends' kids are tracking! You are getting older!"
                                              </div>
                                              <div className="bg-emerald-950/40 p-2 rounded-xl text-[10px] border border-emerald-900/35 leading-normal">
                                                <span className="text-emerald-400 font-bold font-serif block text-[9px]">Gemini Empathy Shift:</span>
                                                "I respect your personal pace, sweetheart, and just wanted to catch up on your week. No stress!"
                                              </div>
                                            </div>
                                          )}

                                          {simTime >= 60 && simTime < 80 && (
                                            <div className="space-y-2 text-left animate-fade-in">
                                              <span className="text-[10px] font-mono text-white/60 uppercase text-[#FF8C61] block font-bold">Part B: Ratifying Bilateral Accords</span>
                                              <div className="bg-white/5 p-2 rounded-xl text-[10px] border border-white/10 space-y-1">
                                                <div className="flex justify-between items-center text-[9px] text-[#FF8C61]">
                                                  <span className="font-serif font-bold">📜 Home Chores compromise</span>
                                                  <span className="font-mono">Pact ID: #8728</span>
                                                </div>
                                                <p className="text-[10px] font-serif text-white/70 italic leading-snug">"Mom agrees to cease direct room checkups, and Daughter commits to a quiet weekend tidy."</p>
                                                <div className="flex justify-between pt-1">
                                                  <span className="text-green-400 font-serif font-bold text-[9px]">✍️ Mom Signed</span>
                                                  <span className="text-green-400 font-serif font-bold text-[9px]">✍️ Daughter Signed</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {simTime >= 80 && simTime < 100 && (
                                            <div className="space-y-2 text-left animate-fade-in">
                                              <span className="text-[10px] font-mono text-white/60 uppercase text-[#FF8C61] block font-bold">Part C: Family Wellness Sync Logs</span>
                                              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex justify-between gap-2.5">
                                                <div className="space-y-1 flex-1">
                                                  <span className="text-[9px] text-white/50 block font-serif">Gemini Routine Sync:</span>
                                                  <span className="text-[10px] leading-tight block text-white/85 font-serif">"Generating joint challenges to align sleep routines..."</span>
                                                </div>
                                                <div className="bg-[#FF8C61]/15 text-[#FF8C61] px-2.5 py-1 rounded-xl text-center self-center flex flex-col justify-center">
                                                  <span className="text-[10px] font-mono font-bold">+50 XP</span>
                                                  <span className="text-[8px] font-serif uppercase tracking-widest block">Harmony</span>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </motion.div>
                                      )}

                                      {/* Stage 4: Scale (100s - 120s) */}
                                      {simTime >= 100 && simTime <= 120 && (
                                        <motion.div
                                          key="scale_sim"
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="space-y-2.5 max-w-sm"
                                        >
                                          <div className="relative inline-block text-4xl">
                                            🌍
                                          </div>
                                          <h4 className="text-sm font-serif font-bold text-[#FF8C61]">
                                            Scene 3: Scale, Social Value & Commercial Roadmap (100s - 120s)
                                          </h4>
                                          <p className="text-[11px] text-white/75 leading-relaxed font-serif">
                                            Preventative peer-trusted psychological support for collegiate homes, counseling institutions, and workspace friction resolution tools. Protect familial safety!
                                          </p>
                                          <div className="flex justify-center gap-1.5">
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded font-mono font-bold">FAMILY WELLNESS SAAS</span>
                                            <span className="bg-[#FF8C61]/10 text-[#FF8C61] border border-[#FF8C61]/30 text-[9px] px-2 py-0.5 rounded font-mono font-bold">PREVENTATIVE SAVINGS</span>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Subtitle Teleprompt Scroll */}
                                  <div className="bg-black/45 p-2 rounded-xl mb-4 border border-white/5 min-h-[44px] flex items-center justify-center text-center">
                                    <p className="text-[10.5px] font-sans font-semibold text-white/95 leading-relaxed max-w-md italic tracking-wide">
                                      "{simTime >= 0 && simTime < 10 && "Welcome to the Bilateral Empathy Shield. Deep in our families, loving concern can easily misalign. Let's see how we dissolve generational friction."}
                                      {simTime >= 10 && simTime < 20 && "Every day, subtle misunderstandings drain parent-daughter emotional batteries. Raw nagging and protective anxiety turn into exhausting silent cold battles."}
                                      {simTime >= 20 && simTime < 30 && "Our solution is a Dual-Empathy translation core powered by server-side Gemini 3.5-Flash. We filter tense words into humor, and formulate peaceful agreements."}
                                      {simTime >= 30 && simTime < 40 && "By combining quiet habit tracking and non-confrontational boundary treaties, we rebuild high-contrast home harmony without forced face-to-face nag cycles."}
                                      {simTime >= 40 && simTime < 55 && "Look at our Tension Dissolver. Mom types a high-pressure query complaining about career or marriage - Gemini restructures it instantly into warm laughter."}
                                      {simTime >= 55 && simTime < 75 && "In the Peace Accords space, common domestic pain points are turned into structured treaties. Both parties sign digitally, setting clean family compromises."}
                                      {simTime >= 75 && simTime < 95 && "While Mom logs her mindful adjustments from afar, Gemini processes the routine timeline to reveal underlying trends, prescribing joint co-wellness challenges."}
                                      {simTime >= 95 && simTime < 110 && "By transforming daily friction into interactive acts of care, we've created a preventative psychological safety buffer for students and sensitive households."}
                                      {simTime >= 110 && simTime <= 120 && "With the scaling potential for universities and corporate cooling chambers, the Empathy Shield is more than a game—it's safety infrastructure. Thank you!"}"
                                    </p>
                                  </div>

                                  {/* Timeline scrubber bar */}
                                  <div className="space-y-1.5 pb-2">
                                    <div className="h-1 bg-white/10 rounded-full relative overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-[#FF8C61] to-[#FFAC82]"
                                        style={{ width: `${(simTime / 120) * 100}%` }}
                                      ></div>
                                    </div>
                                    <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                                      <span>0:00 (Problem)</span>
                                      <span>0:20 (Solution)</span>
                                      <span>0:40 (Live Demo)</span>
                                      <span>1:40 (Value)</span>
                                      <span>2:00</span>
                                    </div>
                                  </div>

                                  {/* Interactive Controls Panel */}
                                  <div className="flex justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => setIsPlayingSim(!isPlayingSim)}
                                        className="w-8 h-8 rounded-full bg-[#FF8C61] hover:bg-[#ff9c75] text-[#4A3B34] flex items-center justify-center cursor-pointer transition shadow"
                                      >
                                        {isPlayingSim ? <Pause className="w-4 h-4 fill-[#4A3B34]" /> : <Play className="w-4 h-4 fill-[#4A3B34] ml-0.5" />}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setIsPlayingSim(false);
                                          setSimTime(0);
                                        }}
                                        className="text-[9px] font-mono bg-white/10 hover:bg-white/20 text-white border border-white/10 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer transition uppercase"
                                      >
                                        Reset Sim
                                      </button>
                                      {isPlayingSim && (
                                        <div className="flex items-center gap-1 font-mono text-[9px] text-[#FF8C61]">
                                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                                          <span className="animate-pulse">STREAMING SIM...</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Jump Shortcuts */}
                                    <div className="flex gap-1.5 text-[8px] font-bold font-mono">
                                      <button onClick={() => { setSimTime(0); setIsPlayingSim(true); }} className="bg-white/10 hover:bg-[#FF8C61] hover:text-[#4A3B34] px-1.5 py-1.5 rounded transition">0:00</button>
                                      <button onClick={() => { setSimTime(20); setIsPlayingSim(true); }} className="bg-white/10 hover:bg-[#FF8C61] hover:text-[#4A3B34] px-1.5 py-1.5 rounded transition">0:20</button>
                                      <button onClick={() => { setSimTime(40); setIsPlayingSim(true); }} className="bg-white/10 hover:bg-[#FF8C61] hover:text-[#4A3B34] px-1.5 py-1.5 rounded transition">0:40</button>
                                      <button onClick={() => { setSimTime(100); setIsPlayingSim(true); }} className="bg-white/10 hover:bg-[#FF8C61] hover:text-[#4A3B34] px-1.5 py-1.5 rounded transition">1:40</button>
                                    </div>
                                  </div>

                                </div>
                              )}
                            </div>

                            {/* Setup & embed options */}
                            <div className="bg-[#FDF8F4] p-3 rounded-2xl border border-[#E8DCCF]/50">
                              <span className="text-[10px] font-bold text-[#4A3B34]/60 uppercase tracking-widest font-serif block mb-1.5">
                                🔗 Embed Finished Screen Recording Link:
                              </span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={demoVideoUrl}
                                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                                  placeholder="Paste YouTube or Loom video share link here"
                                  className="flex-1 bg-white border border-[#E8DCCF] rounded-xl px-3 py-1.5 text-xs text-[#4A3B34] focus:ring-1 focus:ring-[#FF8C61] focus:outline-none placeholder-[#4A3B34]/50"
                                />
                                {demoVideoUrl && (
                                  <button
                                    onClick={() => setDemoVideoUrl("")}
                                    className="px-2.5 text-red-500 hover:text-red-700 font-serif font-semibold text-xs cursor-pointer bg-white border border-[#E8DCCF] rounded-xl transition"
                                  >
                                    Clear Embed
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right column: 120-Second Pitch Script Teleprompter (5 cols) */}
                          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
                            <div className="bg-white rounded-3xl border border-[#E8DCCF] p-4.5 space-y-3 shadow-inner">
                              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-[10px] font-bold text-[#4A3B34]/80 uppercase tracking-widest font-serif">
                                  🎤 RECORDING TELEPROMPTER SCRIPT
                                </span>
                                <span className="text-[9px] text-[#FF8C61] font-bold uppercase font-mono">
                                  EXACT TIME-MARKS
                                </span>
                              </div>

                              {/* Interactive script steps container */}
                              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1 text-xs select-text">
                                
                                <div className={`p-2.5 rounded-2xl border transition ${simTime >= 0 && simTime < 20 ? "bg-[#FF8C61]/10 border-[#FF8C61]/35 shadow-sm scale-[1.01]" : "bg-gray-50/50 border-gray-200/50 opacity-60"}`}>
                                  <div className="flex justify-between text-[9px] font-mono font-bold text-[#4A3B34]/80 mb-1">
                                    <span>Part 1: The Problem (0:00 - 0:20)</span>
                                    <span className="text-[#FF8C61]">20s Target</span>
                                  </div>
                                  <p className="text-[11px] font-serif leading-relaxed text-[#4A3B34] italic font-semibold">
                                    "Under generational differences, parental worries translate into defensive friction, draining young minds. Our app serves as a non-intrusive aesthetic shield to heal domestic ties."
                                  </p>
                                </div>

                                <div className={`p-2.5 rounded-2xl border transition ${simTime >= 20 && simTime < 40 ? "bg-[#FF8C61]/10 border-[#FF8C61]/35 shadow-sm scale-[1.01]" : "bg-gray-50/50 border-gray-200/50 opacity-60"}`}>
                                  <div className="flex justify-between text-[9px] font-mono font-bold text-[#4A3B34]/80 mb-1">
                                    <span>Part 2: The Solution (0:20 - 0:40)</span>
                                    <span className="text-[#FF8C61]">20s Target</span>
                                  </div>
                                  <p className="text-[11px] font-serif leading-relaxed text-[#4A3B34] italic font-semibold">
                                    "Powered by server-side Gemini 3.5-Flash, we filter text tensions into humorous affection, frame binary covenants, and synthesize gentle co-wellness commitments gracefully."
                                  </p>
                                </div>

                                <div className={`p-2.5 rounded-2xl border transition ${simTime >= 40 && simTime < 100 ? "bg-[#FF8C61]/10 border-[#FF8C61]/35 shadow-sm scale-[1.01]" : "bg-gray-50/50 border-gray-200/50 opacity-60"}`}>
                                  <div className="flex justify-between text-[9px] font-mono font-bold text-[#4A3B34]/80 mb-1">
                                    <span>Part 3: Walkthrough (0:40 - 1:40)</span>
                                    <span className="text-[#FF8C61]">60s Target</span>
                                  </div>
                                  <p className="text-[11px] font-serif leading-relaxed text-[#4A3B34] italic font-semibold">
                                    "Observe our Tension Dissolver shifting raw text instantly, our family peace treaty signed bilaterally, and the quiet habit tracker aligning shared health goals with interactive rewards."
                                  </p>
                                </div>

                                <div className={`p-2.5 rounded-2xl border transition ${simTime >= 100 && simTime <= 120 ? "bg-[#FF8C61]/10 border-[#FF8C61]/35 shadow-sm scale-[1.01]" : "bg-gray-50/50 border-gray-200/50 opacity-60"}`}>
                                  <div className="flex justify-between text-[9px] font-mono font-bold text-[#4A3B34]/80 mb-1">
                                    <span>Part 4: Future & Scale (1:40 - 2:00)</span>
                                    <span className="text-[#FF8C61]">20s Target</span>
                                  </div>
                                  <p className="text-[11px] font-serif leading-relaxed text-[#4A3B34] italic font-semibold">
                                    "This is preventative emotional health infrastructure. By transforming familial tension into a shared gamified act of care, we secure family stability. Thank you!"
                                  </p>
                                </div>

                              </div>
                            </div>

                            <div className="bg-emerald-50/55 p-3 rounded-2xl border border-emerald-100/50 text-[10px] leading-relaxed text-[#4A3B34] space-y-1 font-serif">
                              <span className="font-bold text-[#4A3B34] block">💡 Creator Recording Tip:</span>
                              <p className="text-[9px] font-sans text-gray-700 leading-normal">
                                Open this slide on your laptop, click <strong>Play Simulator</strong> on the left, start your screen/webcam recorder, and read the highlighted script blocks as the timer progresses! It fits the 120-second timeline perfectly.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step changer container footer buttons */}
                    <div className="flex gap-2 justify-end border-t border-[#E8DCCF] pt-3 mt-4">
                      <button
                        onClick={() => setDeckStep(prev => Math.max(prev - 1, 0))}
                        className="px-3.5 py-1.5 bg-[#E8DCCF] text-[#4A3B34] hover:bg-[#dec2b3] text-xs font-serif font-bold rounded-full cursor-pointer transition disabled:opacity-45"
                        disabled={deckStep === 0}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (deckStep < 4) {
                            setDeckStep(prev => prev + 1);
                          } else {
                            setActiveTab("translate");
                          }
                        }}
                        className="px-4 py-1.5 bg-[#4A3B34] hover:bg-[#5c4940] text-white text-xs font-serif font-bold rounded-full cursor-pointer transition flex items-center gap-1.5"
                      >
                        <span>{deckStep === 4 ? "Back to Translator" : "Next Slide"}</span>
                        <ArrowRight className="w-3 text-[#FF8C61]" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-xs text-[#4A3B34]/75 font-serif border-t border-[#E8DCCF] pt-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif font-semibold">
          Bilateral Empathy Shield • Google DeepMind AI Sprint Hackathon Demo Pitch (1-Hour Challenge)
        </div>
        <div className="flex items-center gap-2">
          <span>Tech Stack:</span>
          <span className="bg-[#E8DCCF]/45 text-[#4A3B34] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">React 19 + Express</span>
          <span className="bg-[#FF8C61]/15 text-[#FF8C61] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">Gemini 3.5-flash</span>
          <span className="bg-[#4A3B34]/10 text-[#4A3B34] font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">Tailwind v4</span>
        </div>
      </footer>

    </div>
  );
}
