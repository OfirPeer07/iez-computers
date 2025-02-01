import { useState } from "react";
import "./CTFGame.css";
import flagGif from "./Flag.gif";

const levels = {
  1: {
    hints: [
      { id: 1, text: "Check the console...", hidden: true },
      { id: 2, text: "Look for hidden elements in the page!", hidden: true },
      { id: 3, text: "Inspect the CSS for secrets!", hidden: true },
    ],
    flag: "1", // Change to actual flag for Level 1
  },
  2: {
    hints: [
      { id: 4, text: "Check the network tab...", hidden: true },
      { id: 5, text: "Look for encoded messages!", hidden: true },
      { id: 6, text: "Analyze the JavaScript source!", hidden: true },
    ],
    flag: "2", // Change to actual flag for Level 2
  },
};

const CTFGame = () => {
  const [foundHints, setFoundHints] = useState([]);
  const [flagInput, setFlagInput] = useState("");
  const [isFlagCorrect, setIsFlagCorrect] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showFlag, setShowFlag] = useState(false);

  const revealHint = (id) => {
    if (!foundHints.includes(id)) {
      setFoundHints((prevHints) => [...prevHints, id]);
    }
  };

  const checkFlag = () => {
    const correctFlag = levels[currentLevel].flag;
    if (flagInput === correctFlag) {
      handleLevelCompletion();
    }
  };

  const handleLevelCompletion = () => {
    if (currentLevel < Object.keys(levels).length) {
      setCurrentLevel(currentLevel + 1);
    } else {
      setIsFlagCorrect(true);
      setShowFlag(true); // Show flag only when all levels are completed
    }
    setFoundHints([]);
    setFlagInput("");
  };
  
  const successMessage = isFlagCorrect && (
    <p className="success">🎉 Congratulations! 🎉<br></br><span>You completed all levels!</span></p>
  );

  const renderHints = levels[currentLevel].hints.map((hint) => (
    <p
      key={hint.id}
      className={`hint ${foundHints.includes(hint.id) ? "revealed" : "hidden"}`}
      onClick={() => revealHint(hint.id)}
    >
      {foundHints.includes(hint.id) ? hint.text : "[Hidden Hint] Click to reveal"}
    </p>
  ));

  return (
    <div className="ctf-container">
      <h1>Capture The Flag - Web Challenge</h1>
      <p>Level {currentLevel}: Find all the hidden hints and retrieve the flag!</p>
      <div className="hints">{renderHints}</div>
      {showFlag && <img src={flagGif} alt="Flag" className="flag-animation" />}
      <div className="flag-input">
        <input
          type="text"
          placeholder="Enter the flag..."
          value={flagInput}
          onChange={(e) => setFlagInput(e.target.value)}
        />
        <button onClick={checkFlag}>Submit</button>
        {successMessage}
      </div>
    </div>
  );
};

export default CTFGame;
