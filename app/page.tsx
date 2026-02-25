"use client";
import { useEffect, useState } from "react";

const WORDS = [
"aberration","abhor","abstruse","acquiesce","alacrity","amiable","anachronistic",
"antagonize","apathy","appease","arcane","arduous","articulate","austere",
"avarice","banal","benevolent","boisterous","brazen","brevity","candid",
"capricious","catharsis","caustic","censure","chicanery","coerce","cogent",
"complacent","concur","condone","conundrum","copious","corroborate",
"credulous","cursory","dearth","debacle","debilitate","decorum","deference",
"demure","deride","despot","diligent","disdain","disparate","disseminate",
"docile","dogmatic","eclectic","efface","elated","eloquent","emulate",
"enervate","engender","enigmatic","ephemeral","equanimity","erudite",
"esoteric","evanescent","exacerbate","exonerate","fastidious","fervent",
"flagrant","fortuitous","frugal","gregarious","hackneyed","haughty",
"hedonist","hypocrisy","iconoclast","idiosyncratic","impeccable",
"impertinent","impetuous","implacable","implicit","inane","incisive",
"indolent","ineffable","ingenuous","insatiable","insipid","intrepid",
"irony","juxtapose","laconic","lament","laudable","lucid","magnanimous",
"malleable","meticulous","mitigate","nebulous","nonchalant","novice",
"obdurate","obfuscate","obstinate","opaque","ostentatious","paradox",
"paragon","parsimonious","pedantic","perfunctory","pervasive","phlegmatic",
"plethora","pragmatic","precocious","proclivity","prodigal","prolific",
"quaint","querulous","quintessential","rancor","recalcitrant","reclusive",
"reconcile","redundant","revere","rhetoric","robust","sagacious",
"salient","scrutinize","serendipity","spurious","stoic","superfluous",
"surreptitious","tenacious","tenuous","thwart","tranquil","ubiquitous",
"umbrage","venerate","verbose","vindicate","vociferous","wary","zealous"
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(120);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [word, setWord] = useState(randomWord());

  useEffect(() => {
    if (!started || time <= 0) return;
    const timer = setInterval(() => setTime(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, time]);

  function answer(correct: boolean) {
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 10 + newCombo * 2);
    } else {
      setCombo(0);
    }
    setWord(randomWord());
  }

  if (!started) {
    return (
      <div style={styles.center}>
        <h1 style={styles.title}>⚡ BrainFuel ⚡</h1>
        <button style={styles.button} onClick={() => setStarted(true)}>
          Start 2-Minute Battle
        </button>
      </div>
    );
  }

  if (time <= 0) {
    return (
      <div style={styles.center}>
        <h1>🔥 Time's Up 🔥</h1>
        <h2>Score: {score}</h2>
        <button style={styles.button} onClick={() => {
          setTime(120);
          setScore(0);
          setCombo(0);
          setStarted(true);
        }}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <h2>⏳ {time}s</h2>
      <h3>Score: {score}</h3>
      <h4>🔥 Combo: {combo}</h4>
      <div style={styles.card}>
        <h2>{word}</h2>
        <button style={styles.correct} onClick={() => answer(true)}>Know It</button>
        <button style={styles.wrong} onClick={() => answer(false)}>Don't Know</button>
      </div>
    </div>
  );
}

const styles:any = {
  center:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#3b00ff,#000)",color:"white",textAlign:"center"},
  title:{fontSize:"48px"},
  button:{padding:"15px 30px",fontSize:"18px",borderRadius:"12px",background:"#00ff88",border:"none",cursor:"pointer"},
  card:{background:"#111",padding:"30px",borderRadius:"20px",marginTop:"20px"},
  correct:{marginTop:"10px",padding:"10px",background:"#00ff88",border:"none",width:"100%"},
  wrong:{marginTop:"10px",padding:"10px",background:"#ff0044",border:"none",width:"100%"}
};
