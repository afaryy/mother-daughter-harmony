import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const port = 3000;

// Lazy initialize the Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Using fallback mock replies.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API: Health probe
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API 1: Peace Emotion Translator
  app.post("/api/translate", async (req, res) => {
    try {
      const { role, rawThought, vibe, daughterAge } = req.body;
      if (!rawThought) {
        return res.status(400).json({ error: "Missing rawThought parameter" });
      }

      const client = getAi();
      const isMock = !process.env.GEMINI_API_KEY;

      const age = Number(daughterAge) || 19;
      const isTeen = age < 18;
      const daughterStageText = isTeen ? `Teenager (aged ${age}, high-schooler)` : `Young Adult (aged ${age}, college or independent)`;

      const speakerLabel = role === "mom" ? "Mom" : `Daughter (${daughterStageText})`;
      const targetLabel = role === "mom" ? `Daughter (${daughterStageText})` : "Mom";

      // Fallback mocks in case of missing API key, keeping user experience perfect
      if (isMock) {
        let responseMock = {
          translatedText: "Sweetheart, I know you are under a lot of pressure and studying extremely hard. I only bring up schedules because I worry about your exhaustion. Let's collaborate on finding a rhythm that feels nurturing for both of us.",
          underlyingConcern: "Though Mom sounds critical about schedules or device screens, observing your tired eyes sparks instant maternal anxiety for your wellness. Her nagging is an unpolished, protective reflex translated into lectures.",
          peaceBonusAction: "Brew a gentle herbal tea or hot cocoa, place it on her workspace with a cute handwritten note saying 'Take a breather! 🌸', and give her a soft shoulder squeeze.",
          replyOption: "'Thanks Mom, that tea looks so comforting! I'll wrap up my work and head to sleep shortly. Get some rest too, love you!'"
        };

        if (role === "daughter") {
          if (isTeen) {
            responseMock = {
              translatedText: "Mom, I really hear your advice and I know you want the best for my exams. I'm trying to learn self-control and time management. When you offer gentle support instead of rigid commands, it helps me feel safe and step up my responsibility!",
              underlyingConcern: "At age " + age + ", your daughter is navigating intense identity growth. She doesn't want to push you away; she wants to prove she is growing into an capable individual and seeks your warm validation rather than constant supervision.",
              peaceBonusAction: "Take the trash draft piles or wash up the snack dishes, make a cute 'reporting for duty' solute, and say: 'Private reports housekeeping duty complete!'",
              replyOption: "'My sweet girl, I'm so proud to watch you grow. I will practice stepping back and trusting you more. Let's work together!'"
            };
          } else {
            responseMock = {
              translatedText: "Mom, I deeply value your concern and guidance in my early adult years. I am working hard to navigate my independent future. When you share constructive advice rather than commanding directives, it makes me feel respected as an adult!",
              underlyingConcern: "As a young adult of " + age + ", your daughter is transitioning to independent adulthood and carries heavy pressure. She values your maternal bedrock but desperately needs peer-to-peer adult respect, wanting to protect and include you as an ally.",
              peaceBonusAction: "Text her a playful campus selfie or a nice view of your commute saying: 'Your favorite daughter is safe and thinking of you! Hope your day is beautiful!'",
              replyOption: "'I hear you, sweetheart. It's beautiful to watch you find your footing. I will trust your judgements and always be here as your cheerleader!'"
            };
          }
        }
        return res.json(responseMock);
      }

      // Generate the response using Gemini
      const toneGuideline = 
        vibe === "warm" 
          ? "Deep empathy, authentic love, translating hidden warmth, and building mutual trust. Warm comforting tone."
          : vibe === "humorous"
          ? "Unbelievably funny, using witty self-deprecation, cute internet slang, or unexpected metaphors to turn hot anger into immediate laughter."
          : vibe === "logical"
          ? "Presented as a strictly rational, objective, and polite 'Diplomatic Bilateral Whitepaper or Memo' to filter out relationship static and emotional static."
          : "Role reversal perspective. Translate it as if they are admitting their own playful weakness with gentle humor, creating immediate empathy.";

      const prompt = `You are a legendary Empathy Translator & Family Peace Coach specialized in reconciling disputes between mothers and daughters aged 14 to 22. 
The daughter's age is ${age}, corresponding to a ${isTeen ? "teenage high schooler" : "young adult in college or early career"}.

Your goal is to parse raw, emotional, or defensive "hot thoughts" sent by one party to another, decode the hidden love/needs, and present them in a beautifully rewritten, non-defensive format in purely English.

INFORMATION:
Sender: ${speakerLabel}
Recipient: ${targetLabel}
Daughter's age: ${age}

RAW INPUT THOUGHT: "${rawThought}"
SELECTED TRANSLATION VIBE: [${vibe.toUpperCase()}] which requires: ${toneGuideline}

Please analyze the raw input, dissect the true vulnerability and core concern, and reply strictly in JSON format matching the schema. Write all fields strictly in human, authentic, warm English language.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedText: { type: Type.STRING, description: "The beautifully converted, non-defensive message. Keep it polite, engaging, designed to melt anger. Use English." },
              underlyingConcern: { type: Type.STRING, description: "A heartwarming psychological breakdown of the hidden concern or core human need of the speaker, written in English." },
              peaceBonusAction: { type: Type.STRING, description: "A playful, cute, and very specific active mutual action suggestion to break the ice. English." },
              replyOption: { type: Type.STRING, description: "An easy-to-say proposed reply for the receiver of the message to safely land the conversation in harmony. English." }
            },
            required: ["translatedText", "underlyingConcern", "peaceBonusAction", "replyOption"]
          }
        }
      });

      const dataText = response.text ? response.text.trim() : "{}";
      const result = JSON.parse(dataText);
      res.json(result);
    } catch (error: any) {
      console.error("Translate error:", error);
      res.status(500).json({ error: error.message || "Failed to process translation" });
    }
  });

  // API 2: Perspective Reconciliation Sandbox & Treaty Generator
  app.post("/api/reconcile", async (req, res) => {
    try {
      const { topic, momView, daughterView, daughterAge } = req.body;
      if (!momView || !daughterView) {
        return res.status(400).json({ error: "Missing momView or daughterView parameters" });
      }

      const client = getAi();
      const isMock = !process.env.GEMINI_API_KEY;

      const age = Number(daughterAge) || 19;
      const isTeen = age < 18;

      if (isMock) {
        const mockPact = {
          pactTitle: `The Peace & Mutual Understanding Accord on [${topic || "Daily Routine Guidelines"}]`,
          commonalities: "Beneath the surface, Mom and Daughter share deep mutual care. Mom wishes for Daughter's thriving wellness, physical health, and safety, while Daughter works hard for competence, personal growth, and self-direction. They are allies standing in the same corner, not opponents in a boxing ring!",
          momCompromise: "Take a conscious three-second breath before offering advice, replacing directive ultimatums with trusting inquiries like 'I value your judgement—how do you plan to tackle this?'.",
          daughterCompromise: "Proactively send a cheerful text update, location confirmation, or routine safe arrival photo to reduce unnecessary worry, confirming you are safe and happy.",
          pactArticles: [
            "【Article I: Sovereign Boundary Right】Daughter keeps absolute control of her room arrangement & study flow. Even if cluttered, Mom labels it 'Creative Resonance Space' and leaves it untouched.",
            "【Article II: Active Listening Clause】Major schedule negotiations must involve structured listening. Mom starts with 'I want to understand your perspective,' and Daughter replies without defensive interruptions.",
            "【Article III: Emergency De-escalation Brake】If voices rise or frustration flares, either party holds up a hand and says: 'Ice Cream Break!' The argument pauses instantly, and both must sit down to enjoy a cold treat."
          ],
          dailyChallenge: "【Ice-Melting Bonus Challenge】Today, Daughter teaches Mom one funny, modern youth slang word or internet joke, and Mom must attempt to use it in a humorous sentence!"
        };
        return res.json(mockPact);
      }

      const prompt = `You are a high-impact Family Counselor, Professional Mediator, and Psychologist.
We have a mother-daughter differing opinion on the topic: "${topic || "Family Harmony"}".
Mom's Perspective: "${momView}"
Daughter's Perspective: "${daughterView}"
Daughter's Age: ${age} (${isTeen ? "teenage high school student" : "young adult"})

Your mission is to perform a warm, clever analysis of both sides to find their underlying deep unity, point out that they are on the "same team" (re-framing from conflict to shared goals), and generate a legally styled yet highly humorous "Reconciliation Peace Accord" (母女双赢双向协定/条约) written completely in pure, polished English.

The treaty should beautifully balance autonomy (for the daughter) and reassurance (for the mom). Make the clauses balanced, satisfyingly warm, and deeply practical. Respond strictly in JSON format matching the schema.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pactTitle: { type: Type.STRING, description: "A creative, fun, mock-formal title for the peace treaty, in English." },
              commonalities: { type: Type.STRING, description: "Explain why they actually belong on the same team, showing how their concerns complement each other. In English." },
              momCompromise: { type: Type.STRING, description: "A practical, small, loving action of compromise for Mom. English." },
              daughterCompromise: { type: Type.STRING, description: "A practical, small, loving action of compromise for Daughter. English." },
              pactArticles: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "3 simple, highly balanced, mock-legal but deeply loving or humorous articles of compromise, in English." 
              },
              dailyChallenge: { type: Type.STRING, description: "A tiny, very fun interactive game they can play today to completely eliminate tension. English." }
            },
            required: ["pactTitle", "commonalities", "momCompromise", "daughterCompromise", "pactArticles", "dailyChallenge"]
          }
        }
      });

      const dataText = response.text ? response.text.trim() : "{}";
      const result = JSON.parse(dataText);
      res.json(result);
    } catch (error: any) {
      console.error("Reconcile error:", error);
      res.status(500).json({ error: error.message || "Failed to generate reconciliation pact" });
    }
  });

  // API 3: Shared Health & Wellness Journal AI Insights Coach
  app.post("/api/journal-insights", async (req, res) => {
    try {
      const { entries } = req.body;
      if (!entries || !Array.isArray(entries)) {
        return res.status(400).json({ error: "Missing or invalid entries array" });
      }

      const client = getAi();
      const isMock = !process.env.GEMINI_API_KEY;

      if (isMock) {
        const momLogs = entries.filter((e: any) => e.sender === "mom");
        const daughterLogs = entries.filter((e: any) => e.sender === "daughter");
        
        let insight = "Shared journal loaded! Mom is busily brewing warm soups and handling housekeeping—each step represents unspoken motherly affection. Daughter is tackling school, running on high academic stress, but staying positive. AI senses: Daughter's tension is linked to key upcoming goals, and Mom's attentive soup and support act as the ultimate emotional balm.";
        
        if (momLogs.length > 0 && daughterLogs.length > 0) {
          const lMom = momLogs[0];
          const lDau = daughterLogs[0];
          insight = `A double-sided resonance of care detected! Mom is currently feeling [${lMom.mood}], completing [${lMom.activities.join(" / ") || "wellness routines"}]; Daughter is currently feeling [${lDau.mood}], staying committed to [${lDau.activities.join(" / ") || "focused study" }]. Mom's diary highlights deep protective concern, while Daughter proactively shares cafeteria updates to offer peace of mind. This is superb family synergy!`;
        }
        
        const mockInsights = {
          gentleInsight: insight,
          sharedGoals: [
            "🎯 Balanced Sync Goal: Daughter supports her rigorous studies with early sleeping patterns, complementing Mom's morning active walks. Let's conquer a mutual 'Well-rested Streak' this week!",
            "🎯 Emotional Voltage Lift: Mom tries to wind down before 10:30 PM with peaceful music, and Daughter uploads 1 cute daily update or funny school occurrence to keep Mom smiling all week long!"
          ],
          jointActivityProposal: {
            title: "🍵 Virtual Tea Toast & Appreciation Session",
            description: "This weekend, hop on a video call. Mom brings her favorite cooked soup, Daughter holds up a warm tea mug. Raise a virtual glass to each other! Daughter reads aloud two compliments from her journal logs, and Mom guesses how many glasses of water Daughter rank up today. A heartwarming match is guaranteed!",
            happinessPoints: 85
          }
        };
        return res.json(mockInsights);
      }

      const prompt = `You are a warm, highly empathetic AI Family Wellness Coach and Clinical Psychologist specializing in family dynamics, specifically Mother-Daughter co-growth and mutual emotional validation.
We have a Shared Health & Wellness Journal where Mom and Daughter write their daily moods, activities, and personal notes/heartfelt logs.

Here are the recent journal entries for both Mother and Daughter:
${JSON.stringify(entries, null, 2)}

Your task is to analyze these entries to find points of positive synergy, validate their daily efforts, identify mutual care, and output a supportive wellness assessment.
Remember, they are in a mutual alliance. Your feedback should:
1. Provide a beautiful, highly touching "gentleInsight" (Empathy-based intergenerational health and relationship assessment) summarizing the emotional and physical states of both Mom and Daughter. Spot how they care for each other (either explicitly or implicitly).
2. Formulate 2-3 specific, encouraging "sharedGoals" (shared behavioral wellness goals) that leverage their current activities to foster positive reinforcement (e.g. synchronized bedtime habits, water consumption encouragement, emotional offloading, or healthy meal preparation).
3. Suggest 1 fun, lighthearted, and highly creative "jointActivityProposal" (Warm connection and ice-breaking project) with details including:
   - "title" (Title of the proposal, e.g. "The Great Shoulder massage competition")
   - "description" (Detailed guide: what to do, how to participate, why it is fun and relieves stress)
   - "happinessPoints" (Earnable score index, an integer like 50).

Please output your response strictly as a JSON object matching the defined schema. Use pure, elegant English.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gentleInsight: { type: Type.STRING, description: "Warm psychological and physical wellness insight, in English." },
              sharedGoals: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "2-3 shared active health goals, in English." 
              },
              jointActivityProposal: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Fanciful, cute title of the joint activity, in English." },
                  description: { type: Type.STRING, description: "Detailed guide on how they do it together to increase positive feedback, in English." },
                  happinessPoints: { type: Type.INTEGER, description: "Earnable happiness points, e.g. 50." }
                },
                required: ["title", "description", "happinessPoints"]
              }
            },
            required: ["gentleInsight", "sharedGoals", "jointActivityProposal"]
          }
        }
      });

      const dataText = response.text ? response.text.trim() : "{}";
      const result = JSON.parse(dataText);
      res.json(result);
    } catch (error: any) {
      console.error("Journal Insight error:", error);
      res.status(500).json({ error: error.message || "Failed to generate wellness insights" });
    }
  });

  // Client-Side Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
