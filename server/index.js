require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const OpenAI = require("openai");
const PORT = Number(process.env.PORT) || 5050;
const openAiApiKey = process.env.OPENAI_API_KEY;

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  process.env.CLIENT_URL,
].filter(Boolean);

const openai = openAiApiKey
  ? new OpenAI({
      apiKey: openAiApiKey,
    })
  : null;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "ielts-iq-coach-api",
    timestamp: new Date().toISOString(),
  });
});

async function ensureUser() {
  const existing = await prisma.user.findUnique({
    where: { email: "learner@example.com" },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "IELTS Learner",
        email: "learner@example.com",
        targetBand: 6.5,
        currentLevel: "B1",
      },
    });
    console.log("Test user created");
  }
}

async function getLearner(req) {
  const requestedEmail =
    req?.header("x-user-email") ||
    req?.query?.email ||
    "learner@example.com";

  return prisma.user.findUnique({
    where: { email: requestedEmail },
  });
}

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, targetBand = 6.5, currentLevel = "B1" } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({ error: "User already exists" });
    }

    const created = await prisma.user.create({
      data: {
        name,
        email,
        targetBand: Number(targetBand),
        currentLevel,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.get("/api/saved-words", async (req, res) => {
  try {
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedWords = await prisma.savedWord.findMany({
      where: { userId: user.id },
      orderBy: { id: "desc" },
    });

    res.json(savedWords);
  } catch (error) {
    console.error("Fetch saved words error:", error);
    res.status(500).json({ error: "Failed to fetch saved words" });
  }
});

app.post("/api/saved-words", async (req, res) => {
  try {
    const { word, meaning, level, status = "learning" } = req.body;
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!word || !meaning || !level) {
      return res
        .status(400)
        .json({ error: "word, meaning, and level are required" });
    }

    const existing = await prisma.savedWord.findFirst({
      where: {
        userId: user.id,
        word,
      },
    });

    if (existing) {
      return res.json(existing);
    }

    const created = await prisma.savedWord.create({
      data: {
        word,
        meaning,
        level,
        status,
        userId: user.id,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Create saved word error:", error);
    res.status(500).json({ error: "Failed to save word" });
  }
});

app.patch("/api/saved-words/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await prisma.savedWord.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Saved word not found" });
    }

    const updated = await prisma.savedWord.update({
      where: { id: Number(id) },
      data: { status: status || existing.status },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update saved word error:", error);
    res.status(500).json({ error: "Failed to update saved word" });
  }
});

app.delete("/api/saved-words/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await prisma.savedWord.findFirst({
      where: { id: Number(id), userId: user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Saved word not found" });
    }

    await prisma.savedWord.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Delete saved word error:", error);
    res.status(500).json({ error: "Failed to delete saved word" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedWords = await prisma.savedWord.findMany({
      where: { userId: user.id },
      orderBy: { id: "desc" },
      take: 8,
    });

    const [totalSaved, learned, difficult, learning, lastQuiz, quizResults] =
      await Promise.all([
        prisma.savedWord.count({ where: { userId: user.id } }),
        prisma.savedWord.count({
          where: { userId: user.id, status: "learned" },
        }),
        prisma.savedWord.count({
          where: { userId: user.id, status: "difficult" },
        }),
        prisma.savedWord.count({
          where: { userId: user.id, status: "learning" },
        }),
        prisma.quizResult.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.quizResult.findMany({ where: { userId: user.id } }),
      ]);

    const avgScore =
      quizResults.length === 0
        ? 0
        : Math.round(
            quizResults.reduce(
              (sum, result) => sum + (result.score / result.total) * 100,
              0,
            ) / quizResults.length,
          );

    res.json({
      totalSaved,
      learned,
      difficult,
      learning,
      recentWords: savedWords,
      lastQuiz,
      avgScore,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const totalSaved = await prisma.savedWord.count({
      where: { userId: user.id },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      targetBand: user.targetBand,
      currentLevel: user.currentLevel,
      stats: {
        savedWords: totalSaved,
        learned: await prisma.savedWord.count({
          where: { userId: user.id, status: "learned" },
        }),
        difficult: await prisma.savedWord.count({
          where: { userId: user.id, status: "difficult" },
        }),
        learning: await prisma.savedWord.count({
          where: { userId: user.id, status: "learning" },
        }),
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

app.patch("/api/profile", async (req, res) => {
  try {
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name, email, targetBand, currentLevel } = req.body;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
        targetBand:
          targetBand === undefined ? user.targetBand : Number(targetBand),
        currentLevel: currentLevel ?? user.currentLevel,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.post("/api/quiz", async (req, res) => {
  try {
    const { score, total } = req.body;
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (typeof score !== "number" || typeof total !== "number") {
      return res
        .status(400)
        .json({ error: "score and total must be numbers" });
    }

    const result = await prisma.quizResult.create({
      data: {
        score,
        total,
        userId: user.id,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Save quiz error:", error);
    res.status(500).json({ error: "Failed to save quiz result" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await prisma.message.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const { content, mode = "general" } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const user = await getLearner(req);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userMessage = await prisma.message.create({
      data: {
        role: "user",
        content,
        userId: user.id,
      },
    });

    let botText;

    try {
      const systemPrompt = `
You are an IELTS teacher and assistant.

Be clear, helpful, and practical.

Current mode: ${mode}

Mode behavior:
- general → answer naturally and briefly
- explain → give meaning, collocations, level, and one IELTS example
- speaking → give IELTS speaking questions and one model answer
- writing → improve the writing and explain the main fixes
- quiz → quiz the learner on vocabulary
- check → fix grammar, wording, and explain the correction

Keep answers natural and not too long.
      `.trim();

      if (!openai) {
        throw new Error("OPENAI_API_KEY is not configured");
      }

      const aiResponse = await openai.responses.create({
        model: "gpt-5.4",
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content,
          },
        ],
      });

      botText =
        aiResponse.output_text || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.log("AI fallback:", error.message);

      const fallbackReplies = {
        general: `AI is temporarily unavailable, but I can still guide the task manually.

You asked: "${content}"

Try asking:
- explain this word
- check this sentence
- give me IELTS speaking questions
- improve this paragraph`,

       explain: `Word focus: "${content.replace(/explain/gi, "").trim()}"

Meaning:
Give the core meaning in simple words.

Example:
Use it in one IELTS-style sentence.

Also think about:
- synonym
- collocation
- topic
- level

Mini model:
"significant" = important or noticeable
IELTS sentence: There was a significant increase in housing costs.
Synonym: notable
Collocation: significant increase`,

        speaking: `AI is temporarily unavailable, but here are IELTS-style speaking prompts:

1. What do you think about this topic?
2. Why is it important in modern society?
3. Can you give a personal example?
4. What are its advantages and disadvantages?

Send me your answer and I can still help you improve it manually.`,

        writing: `AI is temporarily unavailable.

Send me:
- one sentence
- one paragraph
- or your essay intro

I can still help you structure what to improve:
1. grammar
2. vocabulary
3. coherence
4. stronger linking words`,

        quiz: `AI is temporarily unavailable, but here is a mini quiz:

1. What does "${content}" mean?
2. Use it in one sentence.
3. Give one synonym.
4. Is it formal, neutral, or informal?`,

        check: `AI is temporarily unavailable.

Paste your sentence like this:
"My sentence: ..."

Then I can help you check:
- grammar
- word choice
- natural phrasing`,
      };

      let detectedMode = mode || "general";

      if (detectedMode === "general" && content.toLowerCase().includes("explain")) {
        detectedMode = "explain";
      } else if (detectedMode === "general" && content.toLowerCase().includes("speak")) {
        detectedMode = "speaking";
      } else if (
        detectedMode === "general" &&
        content.toLowerCase().includes("essay") ||
        detectedMode === "general" &&
        content.toLowerCase().includes("write")
      ) {
        detectedMode = "writing";
      } else if (detectedMode === "general" && content.toLowerCase().includes("quiz")) {
        detectedMode = "quiz";
      } else if (detectedMode === "general" && content.toLowerCase().includes("check")) {
        detectedMode = "check";
      }

      botText = fallbackReplies[detectedMode] || fallbackReplies.general;
    }

    const botMessage = await prisma.message.create({
      data: {
        role: "assistant",
        content: botText,
        userId: user.id,
      },
    });

    res.json({
      userMessage,
      botMessage,
    });
  } catch (error) {
    console.error("Message send error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

ensureUser()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Startup error:", error);
  });
