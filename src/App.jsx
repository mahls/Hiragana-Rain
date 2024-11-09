import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// List of Japanese words and their romaji with English translations
const allWords = [
  { japanese: 'ねこ', romaji: 'neko', english: 'cat' },
  { japanese: 'いぬ', romaji: 'inu', english: 'dog' },
  { japanese: 'みず', romaji: 'mizu', english: 'water' },
  { japanese: 'たべる', romaji: 'taberu', english: 'to eat' },
  { japanese: 'のみもの', romaji: 'nomimono', english: 'drink' },
  { japanese: 'あさ', romaji: 'asa', english: 'morning' },
  { japanese: 'ゆうひ', romaji: 'yuuhi', english: 'sunset' },
  { japanese: 'おはよう', romaji: 'ohayou', english: 'good morning' },
  { japanese: 'ありがとう', romaji: 'arigatou', english: 'thank you' },
  { japanese: 'さようなら', romaji: 'sayounara', english: 'goodbye' },
  { japanese: 'はい', romaji: 'hai', english: 'yes' },
  { japanese: 'いいえ', romaji: 'iie', english: 'no' },
  { japanese: 'としょかん', romaji: 'toshokan', english: 'library' },
  { japanese: 'とけい', romaji: 'tokei', english: 'clock/watch' },
];

const words = allWords;

function App() {
  const [level, setLevel] = useState(1);
  const [fallingWords, setFallingWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);

  // Input box position
  const inputBoxHeight = 64;
  const inputBoxPosition = window.innerHeight - inputBoxHeight;

  // Get the width of the window
  const windowWidth = window.innerWidth;

  // Disable scroll on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Start the game
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomX = Math.random() * (windowWidth - 200);
        setFallingWords((prev) => [
          ...prev,
          { id: Date.now(), ...randomWord, x: randomX, y: -100, velocity: Math.random() * 0.8 + 1 },
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gamePaused]);

  // Move the falling words down over time
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        setFallingWords((prev) => {
          return prev
            .map((word) => {
              const newY = word.y + word.velocity;
              if (newY > inputBoxPosition) {
                return null;
              }
              return { ...word, y: newY };
            })
            .filter(Boolean); // Remove null values
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [inputBoxPosition, gamePaused]);

  // Handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Check the input and update score for any word
  const handleSubmit = () => {
    const matchedWords = fallingWords.filter((word) =>
      word.romaji.toLowerCase() === userInput.toLowerCase()
    );

    if (matchedWords.length > 0) {
      setScore((prev) => prev + matchedWords.length);
      setScoreAnimation(true);
      setFallingWords((prev) =>
        prev.filter((word) => !matchedWords.some((matched) => matched.id === word.id))
      );
    }
    setUserInput('');
  };

  // Handle key press for submitting answer
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Falling words animation variants
  const fallingWordVariants = {
    initial: { y: -100, rotate: 0 },
    animate: (custom) => ({
      y: custom.y,
      rotate: Math.random() * 20 - 10,
      scale: 1 + Math.random() * 0.1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    }),
    exit: { y: 100, opacity: 0, rotate: 0 },
  };

  // Score animation variants
  const scoreVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1.2,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (scoreAnimation) {
      const timer = setTimeout(() => {
        setScoreAnimation(false); // Reset animation after 1 second
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [scoreAnimation]);

  // Pause the game when the tab is not focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setGamePaused(true);
      } else {
        setGamePaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="bg-stone-900 h-screen text-white relative">
      {/* Game Score */}
      <div className="absolute top-4 left-4 text-3xl font-bold">
        <motion.span
          key={score}
          className="ml-4 text-400"
          variants={scoreVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          Score: {score}
        </motion.span>
      </div>

      {/* Toggle Romaji and English Button */}
      <div className="absolute top-4 right-4">
        <motion.button
          onClick={() => setShowTranslations((prev) => !prev)}
          className="bg-violet-700 text-white px-4 py-2 rounded-lg text-sm md:text-xl font-bold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {showTranslations ? 'Hide Romaji & English' : 'Show Romaji & English'}
        </motion.button>
      </div>

      {/* Falling Words */}
      {fallingWords.map((word) => (
        <motion.div
          key={word.id}
          custom={{ y: word.y }}
          variants={fallingWordVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: 'absolute',
            top: `${word.y}px`,
            left: `${word.x}px`,
            fontSize: '2rem', // Can adjust based on screen size
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {word.japanese}
          {showTranslations && (
            <>
              <span className="ml-2 text-xs md:text-xl font-light text-stone-400">({word.romaji})</span>
              <span className="ml-2 text-xs md:text-xl font-light text-stone-300">({word.english})</span>
            </>
          )}
        </motion.div>
      ))}

      {/* Input Box */}
      <div className="fixed bottom-0 w-full pb-10 px-2 md:px-4">
        <input
          className="rounded bg-transparent border-4 border-violet-700 text-white w-full h-12 text-center font-bold text-xl md:text-2xl"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type romaji here..."
        />
      </div>
    </div>
  );
}

export default App;
