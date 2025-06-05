
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

const zones = [
  { name: "Salt Citadel", color: "white", tiles: [1, 2, 3, 4, 5, 6] },
  { name: "Acid Arena", color: "red", tiles: [7, 8, 9, 10, 11, 12] },
  { name: "Base Bay", color: "blue", tiles: [13, 14, 15, 16, 17, 18] },
  { name: "pH Pit", color: "green", tiles: [19, 20, 21, 22, 23, 24] },
  { name: "Reaction Ridge", color: "yellow", tiles: [25, 26, 27, 28, 29, 30] },
];

const questions = {
  "Salt Citadel": ["Define salt and give an example.", "Write the formula for common salt.", "Use of washing soda?", "Use of sodium bicarbonate?"],
  "Acid Arena": ["What is a monobasic acid?", "Which acid is found in vinegar?", "Reaction: HCl + Zn → ?"],
  "Base Bay": ["What is an Arrhenius base?", "Why is NH4OH not a strong base?", "Drawbacks of Arrhenius theory?"],
  "pH Pit": ["pH of blood?", "Color of methyl orange in base?", "Role of pH in digestion?"],
  "Reaction Ridge": ["Define neutralization reaction.", "HCl + NaOH → ?", "Precipitation reaction?"]
};

const getZone = (tile) => zones.find((z) => z.tiles.includes(tile));
const getRandomQuestion = (zoneName) => {
  const qList = questions[zoneName];
  return qList[Math.floor(Math.random() * qList.length)];
};

const playerIcons = ["🧪", "⚗️", "🔬"];

export default function App() {
  const [tiles, setTiles] = useState([1, 1, 1]);
  const [scores, setScores] = useState([0, 0, 0]);
  const [dice, setDice] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [question, setQuestion] = useState("");
  const [names, setNames] = useState(["", "", ""]);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);

  const diceAudio = useRef(null);
  const bgMusic = useRef(null);

  useEffect(() => {
    if (!muted) {
      bgMusic.current.play().catch(() => {});
    } else {
      bgMusic.current.pause();
    }
  }, [muted]);

  const rollDice = () => {
    if (diceAudio.current && !muted) {
      diceAudio.current.play();
    }

    const d = Math.ceil(Math.random() * 6);
    const updatedTiles = [...tiles];
    const updatedScores = [...scores];
    let next = updatedTiles[currentPlayer] + d;
    if (next > 30) next = updatedTiles[currentPlayer];
    updatedTiles[currentPlayer] = next;
    updatedScores[currentPlayer] += 1;
    const zone = getZone(next);

    setTiles(updatedTiles);
    setScores(updatedScores);
    setDice(d);
    setQuestion(zone ? getRandomQuestion(zone.name) : "");
    setCurrentPlayer((currentPlayer + 1) % 3);
  };

  if (!entered) {
    return (
      <div className="p-4 space-y-2">
        <h2>Enter Player Names</h2>
        {[0, 1, 2].map((i) => (
          <input
            key={i}
            placeholder={`Player ${i + 1}`}
            value={names[i]}
            onChange={(e) => {
              const updated = [...names];
              updated[i] = e.target.value;
              setNames(updated);
            }}
          />
        ))}
        <button onClick={() => setEntered(true)}>Start Game</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <audio ref={diceAudio} src="/sounds/dice-roll.mp3" preload="auto" />
      <audio ref={bgMusic} src="/sounds/bg-music.mp3" loop preload="auto" />

      <div>
        <h1>PH Battleboard</h1>
        <button onClick={() => setMuted(!muted)}>
          {muted ? "🔇 Mute" : "🔊 Sound"}
        </button>
      </div>

      <p>🎲 Turn: {names[currentPlayer] || `Player ${currentPlayer + 1}`} {playerIcons[currentPlayer]}</p>
      <p>Dice Roll: {dice}</p>

      {tiles.map((t, i) => (
        <p key={i}>{names[i] || `Player ${i + 1}`} {playerIcons[i]} - Tile: {t} | Score: {scores[i]}</p>
      ))}

      <button onClick={rollDice}>Roll Dice</button>

      {question && (
        <Card className="bg-muted">
          <CardContent className="p-4">
            <p><strong>Question:</strong> {question}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-6 gap-1">
        {[...Array(30)].map((_, i) => {
          const tileNum = i + 1;
          const zone = getZone(tileNum);
          const bgColor = zone ? `bg-${zone.color}-200` : "bg-gray-200";
          const playerHere = tiles.map((t, idx) => (t === tileNum ? playerIcons[idx] : null)).filter(Boolean);
          return (
            <div key={tileNum} className={`h-16 flex flex-col items-center justify-center border text-sm ${bgColor}`}>
              <div>{tileNum}</div>
              <div>{playerHere.join(" ")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
