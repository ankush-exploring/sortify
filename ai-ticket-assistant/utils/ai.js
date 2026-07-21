const analyzeTicket = async (ticket) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log("GROQ_API_KEY not set — skipping AI analysis");
    return null;
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a ticket triage assistant. Analyze the support ticket and return ONLY a valid JSON object with no extra text or markdown:

{
  "summary": "Short 1-2 sentence summary",
  "priority": "low" | "medium" | "high" | "critical",
  "helpfulNotes": "Technical explanation with useful tips",
  "relatedSkills": ["Skill1", "Skill2"]
}`,
          },
          {
            role: "user",
            content: `Title: ${ticket.title}\nDescription: ${ticket.description}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      console.log("Groq returned empty response");
      return null;
    }

    const cleaned = raw.replace(/```json\s*|\s*```/gi, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.log("AI analysis failed:", err.message);
    return null;
  }
};

export default analyzeTicket;
