export async function POST(req: Request) {
  try {
    const { difficulty } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an SAT exam writer. Return ONLY valid JSON."
          },
          {
            role: "user",
            content: `Generate one SAT Words-in-Context question. Difficulty: ${difficulty}. Return JSON with keys: id, difficulty, passage, targetWord, question, choices (array of {label,text}), correctAnswer, explanation.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices?.length) {
      return Response.json({ error: "No response from model" }, { status: 500 });
    }

    const content = data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return Response.json({ error: "Invalid JSON from model", raw: content }, { status: 500 });
    }

    return Response.json(parsed);

  } catch (err:any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
