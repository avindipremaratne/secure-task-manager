const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic();

exports.generateDescription = async (req, res) => {
  const { title } = req.body;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: `You are a task management assistant. Generate a short, clear task description for a task titled: "${title}". 
Rules:
- Do NOT repeat the title
- Do NOT use markdown formatting
- Write 1-2 plain sentences only
- Be specific and actionable`,
        },
      ],
    });

    const rawText = message.content[0].text;
    const cleanText = rawText.replace(/^#+\s*/gm, "").trim();
    res.json({ description: cleanText });
  } catch (err) {
    console.error("AI Description Generation Error:", err);
    res.status(500).json({ error: "Failed to generate task description" });
  }
};
