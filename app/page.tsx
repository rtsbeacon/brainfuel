"use client";
import { useEffect, useState } from "react";
import seed from "../data/seedQuestions.json";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(120);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!started || time <= 0) return;
    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, time]);

  async function loadQuestion() {
    const useSeed = Math.random() < 0.7;

    if (useSeed) {
      const q = seed[Math.floor(Math.random() * seed.length)];
      setCurrent(q);
    } else {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ difficulty: "medium" })
      });
      const q = await res.json();
      setCurrent(q);
    }
  }

  function answer(choice: string) {
    if (choice === current.correctAnswer) {
      setScore(s => s + 10);
      setFeedback("Correct!");
    } else {
      setFeedback(current.explanation);
    }

    setTimeout(() => {
      setFeedback(null);
      loadQuestion();
    }, 2000);
  }

  if (!started) {
    return (
      <div style={styles.center}>
        <h1>⚡ SAT Words in Context ⚡</h1>
        <button style={styles.button} onClick={() => {
          setStarted(true);
          loadQuestion();
        }}>
          Start 2-Minute Battle
        </button>
      </div>
    );
  }

  if (time <= 0) {
    return (
      <div style={styles.center}>
        <h1>Time's Up</h1>
        <h2>Score: {score}</h2>
      </div>
    );
  }

  if (!current) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.center}>
      <h3>⏳ {time}s</h3>
      <p style={{maxWidth:600}}>{current.passage}</p>
      <h4>{current.question}</h4>

      {current.choices.map((c:any) => (
        <button key={c.label} style={styles.choice} onClick={() => answer(c.label)}>
          {c.label}) {c.text}
        </button>
      ))}

      {feedback && <p style={{marginTop:20}}>{feedback}</p>}
    </div>
  );
}

const styles:any = {
  center:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#111",color:"white",textAlign:"center",padding:20},
  button:{padding:"15px 30px",fontSize:18,background:"#00ff88",border:"none"},
  choice:{marginTop:10,padding:10,width:400,maxWidth:"90%"}
};
