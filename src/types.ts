export type UserRole = "mom" | "daughter";

export type TranslationVibe = "warm" | "humorous" | "logical" | "role_swap";

export interface TranslationInput {
  role: UserRole;
  rawThought: string;
  vibe: TranslationVibe;
}

export interface TranslationResult {
  translatedText: string;
  underlyingConcern: string;
  peaceBonusAction: string;
  replyOption: string;
}

export interface ReconcileInput {
  topic: string;
  momView: string;
  daughterView: string;
}

export interface ReconcileResult {
  pactTitle: string;
  commonalities: string;
  momCompromise: string;
  daughterCompromise: string;
  pactArticles: string[];
  dailyChallenge: string;
}

export interface SavedPact extends ReconcileResult {
  id: string;
  momSigned: boolean;
  daughterSigned: boolean;
  signedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: UserRole;
  rawThought: string;
  translatedText: string;
  vibe: TranslationVibe;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  sender: UserRole;
  mood: string;
  moodEn: string;
  activities: string[];
  notes: string;
  timestamp: string;
}

export interface JournalInsightResult {
  gentleInsight: string;
  sharedGoals: string[];
  jointActivityProposal: {
    title: string;
    description: string;
    happinessPoints: number;
  };
}
