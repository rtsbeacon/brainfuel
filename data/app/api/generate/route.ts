export async function POST(req: Request) {
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
          content: "You are an SAT exam writer. Generate one Digital SAT Words-in-Context question in strict JSON format matching this schema: {id, difficulty, passage, targetWord, question, choices:[{label,text}], correctAnswer, explanation}. Do not include commentary."
        },
        {
          role: "user",
          content: `Difficulty: ${difficulty}`
        }
      ],
      temperature: 0.8
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;

  return Response.json(JSON.parse(content));
}
