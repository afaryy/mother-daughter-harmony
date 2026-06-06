export interface ConflictPreset {
  id: string;
  topic: string;
  topicEn: string;
  emoji: string;
  momThought: string;
  daughterThought: string;
  stage: "teen" | "adult" | "both";
}

export const PRESETS: ConflictPreset[] = [
  {
    id: "sleep",
    topic: "Sleep Schedules & Screen Time",
    topicEn: "Sleep Schedules & Screen Time",
    emoji: "🌙",
    momThought: "You stay up until 2 AM staring at your phone and can't get out of bed until noon! It's so unhealthy, your face looks completely pale and exhausted. If you don't build good habits now, you'll never survive a real job or mature routine later!",
    daughterThought: "I'm exhausted from homework and classes all day. Late at night is the only peaceful time I get to chat with friends, listen to music, and unwind without constant supervision. Stop trying to enforce an old-fashioned schedule on my body clock!",
    stage: "both"
  },
  {
    id: "curfew",
    topic: "Curfews & Social Independence",
    topicEn: "Curfews & Social Independence",
    emoji: "🕒",
    momThought: "Why are you staying out so late with friends? It's past 9 PM! You should be home studying or resting, not wandering the streets. You're too young to be out late—it's unsafe, and I'm anxious sick waiting for you!",
    daughterThought: "It's just Friday evening and I'm hanging out with my friends at the mall. You track my location 24/7 on your phone and text me every 15 minutes! It is incredibly embarrassing. Give me some basic trust and space to grow up!",
    stage: "teen"
  },
  {
    id: "screentime",
    topic: "Gaming, Screentime & Studies",
    topicEn: "Gaming, Screentime & Studies",
    emoji: "🎮",
    momThought: "You're constantly glued to your PC or phone playing video games! Your grades are dropping, and your eyes are getting ruined. Back in my school years, we studied constantly and never had these brain-rotting distractions.",
    daughterThought: "I've been studying and doing assignments for six hours straight! I just wanted to play one quick round which is how my friends and I hang out and destress. You always walk in at the worst second and assume I play games all day!",
    stage: "teen"
  },
  {
    id: "calls",
    topic: "Frequent Check-ins & Non-replies",
    topicEn: "Frequent Check-ins & Non-replies",
    emoji: "📱",
    momThought: "You ignore my texts and decline my video calls. I'm your mother! I only call because I love you and worry you're unsafe. My mind completely runs wild with terrible thoughts when you ignore me for hours. Show some basic maturity!",
    daughterThought: "I'm in lectures, at group study sessions, or eating with classmates. Your relentless back-to-back calls make me look childish in front of everyone. I'm an adult now—stop treating me like a lost toddler. I will reply when I'm free!",
    stage: "adult"
  },
  {
    id: "career",
    topic: "Stable Hometown Options vs Capital Passions",
    topicEn: "Stable Hometown Options vs Capital Passions",
    emoji: "💼",
    momThought: "You should prepare for a stable, secure job like a local civil servant or a teacher nearby. You'll get benefits, a peaceful life, and regular holidays. Working 12 hours a day at a chaotic startup in a huge, expensive metropolis is a stressful trap!",
    daughterThought: "I don't want a boring office job in a small suburb where I can predict my entire next thirty years on day one! I want to work in creative design and tackle tech innovations in the big city. Even if it's high pressure, it's my dream!",
    stage: "adult"
  },
  {
    id: "messy_room",
    topic: "Room Cleanliness & Personal Workspace",
    topicEn: "Room Cleanliness & Personal Workspace",
    emoji: "🧺",
    momThought: "Your room looks like an absolute disaster zone! Clothes are piled in heaps and you don't even sweep the dust off your desk. If you can't even manage a single bedroom, how will you ever organize a household of your own?",
    daughterThought: "I have my own visual logic for my space. My reference materials, notes, and textbook stacks are laid out exactly where I can see and access them easily. When you 'tidy up' without asking, I lose everything. Respect my personal boundaries!",
    stage: "both"
  }
];

export interface RolePreset {
  role: "mom" | "daughter";
  raw: string;
  label: string;
  stage: "teen" | "adult" | "both";
}

export const THOUGHT_PRESETS: RolePreset[] = [
  {
    role: "mom",
    label: "On Unhealthy Bedtimes 🌙",
    raw: "Look at the time! You're still awake staring at your phone. You won't be able to wake up tomorrow, and you are destroying your immune system and health!",
    stage: "both"
  },
  {
    role: "mom",
    label: "On Ignoring Calls/Texts 😤",
    raw: "I've called you three times and texted you hours ago with no response. You have no respect for my peace of mind! I'm sitting here worried sick.",
    stage: "both"
  },
  {
    role: "mom",
    label: "On Teen Screentime & Focus 🎮",
    raw: "You spend all your free time on social media and games. Your school grades are going down and you are wasting your potential on brain-rot content!",
    stage: "teen"
  },
  {
    role: "mom",
    label: "On Career Stability & Safety 🎀",
    raw: "Why do you refuse to apply for stable local jobs? You want to move to a dangerous big city to work long hours for a startup that could fail tomorrow. Be realistic!",
    stage: "adult"
  },
  {
    role: "daughter",
    label: "On Constant Hovering / Study Interruption 😩",
    raw: "I told you I was in the middle of preparing an important exam presentation! You keep barging in to offer fruit, sweep the floor, and criticize my messy desk. It completely breaks my focus!",
    stage: "both"
  },
  {
    role: "daughter",
    label: "On Lack of Teen Independence 🛑",
    raw: "I'm not a child anymore! You watch my grades like a hawk, check who I chat with, and track my location whenever I walk to the convenience store. Let me breathe!",
    stage: "teen"
  },
  {
    role: "daughter",
    label: "On Imposing Career Choices 🤐",
    raw: "Your ideas about work are stuck in the 1990s! Local bureaucratic jobs are soul-crushing for me. I need a modern career where I can design, build, and earn my own path.",
    stage: "adult"
  }
];

export interface JournalPreset {
  id: string;
  sender: "mom" | "daughter";
  mood: string;
  moodEn: string;
  activities: string[];
  notes: string;
  label: string;
}

export const JOURNAL_MOODS = [
  { emoji: "😀", label: "Joyful & Energetic", en: "happy", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { emoji: "😌", label: "Calm & Centered", en: "peaceful", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { emoji: "😰", label: "Anxious & Overwhelmed", en: "stressed", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { emoji: "🥱", label: "Exhausted & Sleepy", en: "tired", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { emoji: "😔", label: "Downcast & Quiet", en: "sad", color: "text-blue-600 bg-blue-50 border-blue-200" }
];

export const MOM_ACTIVITIES = [
  "🍵 Brewed nourishing herbal tea / soup",
  "🏃‍♀️ Took an early morning brisk walk",
  "💤 Slept on time before 10:30 PM",
  "🧺 Organized home space / watered plants",
  "📱 Limited screen time on social media",
  "❤️ Practiced active listening without interrupting"
];

export const DAUGHTER_ACTIVITIES = [
  "🚶‍♀️ Walked to class / went on a run",
  "💤 Put phone away & slept before midnight",
  "📖 Focused study sessions / completed assignments",
  "🥗 Ate 3 healthy meals & skipped midnight snacks",
  "🍵 Hydrated well (2L+ water ingested)",
  "🫂 Shared daily updates / photos voluntarily"
];

export const DEFAULT_JOURNAL_ENTRIES = [
  {
    id: "hist-1",
    sender: "mom" as const,
    mood: "😌 Calm & Centered",
    moodEn: "peaceful",
    activities: ["🍵 Brewed nourishing herbal tea / soup", "🏃‍♀️ Took an early morning brisk walk"],
    notes: "Bought a basket of fresh sweet strawberries today and simmered pear silver ear sweet soup. Although she sometimes finds me a bit talkative, I just want her to stay healthy. I hope she drinks the soup to cool down her stress.",
    timestamp: "2026-06-05 21:15"
  },
  {
    id: "hist-2",
    sender: "daughter" as const,
    mood: "😰 Anxious & Overwhelmed",
    moodEn: "stressed",
    activities: ["🚶‍♀️ Walked to class / went on a run", "📖 Focused study sessions / completed assignments"],
    notes: "My school project draft was rejected twice. I studied in the library until my stomach locked up. I really miss home cooking. I saw the photo of the sweet pear soup Mom sent me. Even though I joked that it's too sweet, my heart felt incredibly warm.",
    timestamp: "2026-06-05 21:40"
  }
];

export const JOURNAL_PRESETS: JournalPreset[] = [
  {
    id: "jp-mom-1",
    sender: "mom",
    mood: "😌 Calm & Centered",
    moodEn: "peaceful",
    activities: ["🍵 Brewed nourishing herbal tea / soup", "❤️ Practiced active listening without interrupting"],
    notes: "I took a communications class online and tried to hold back my nagging today. When my girl called to express frustration, I just listened and validated her, telling her I put sweet pear soup in the fridge for when she visits.",
    label: "Mom's Caring Herbal Tea 🍲"
  },
  {
    id: "jp-mom-2",
    sender: "mom",
    mood: "😰 Anxious & Overwhelmed",
    moodEn: "stressed",
    activities: ["🏃‍♀️ Took an early morning brisk walk", "📱 Limited screen time on social media"],
    notes: "My knees were a bit sore today, and I caught myself reading sensationalized parent columns. I felt a surge of worry about how she was managing her stress, but took a brisk walk at the park and felt way better.",
    label: "Mom's Wellness Brisk Walk 🏃‍♀️"
  },
  {
    id: "jp-daughter-1",
    sender: "daughter",
    mood: "🥱 Exhausted & Sleepy",
    moodEn: "tired",
    activities: ["💤 Put phone away & slept before midnight", "🫂 Shared daily updates / photos voluntarily"],
    notes: "Finally went to bed at 11:30 PM last night! Woke up feeling clear-headed. Sent Mom a photo of my school cafeteria pumpkin porridge. She sent back a heart emoji—a simple but amazing start to my day!",
    label: "Daughter's Healthy Bedtime Habit 💤"
  },
  {
    id: "jp-daughter-2",
    sender: "daughter",
    mood: "😀 Joyful & Energetic",
    moodEn: "happy",
    activities: ["🚶‍♀️ Walked to class / went on a run", "🥗 Ate 3 healthy meals & skipped midnight snacks"],
    notes: "Went for a 2K morning jog with my hallmates and enjoyed a warm, healthy breakfast. Posted a cheerful selfie and Mom liked it instantly! Keeping a structured schedule does wonders for mental balance.",
    label: "Daughter's Energized Routine 🥗"
  }
];
