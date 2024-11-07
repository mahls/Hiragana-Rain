import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Data: Hiragana characters and their corresponding Romaji
const hiraganaData = [
    { character: 'か', romaji: 'ka' },
    { character: 'き', romaji: 'ki' },
    { character: 'く', romaji: 'ku' },
    { character: 'け', romaji: 'ke' },
    { character: 'こ', romaji: 'ko' }
  ];
  
const A = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [scoreChange, setScoreChange] = useState(null);
  const [comboStreak, setComboStreak] = useState(0); // Tracking the combo streak

  // Randomly pick a Hiragana character and generate 4 options
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Function to generate a new question and options
  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * hiraganaData.length);
    const correctAnswer = hiraganaData[randomIndex];

    // Create a fixed list of all possible answers (always a, e, i, o, u)
    const allAnswers = ['a', 'e', 'i', 'o', 'u'];

    // Get the correct answer and 4 options
    const options = allAnswers.map(romaji => {
      return hiraganaData.find(item => item.romaji === romaji);
    });

    setCurrentQuestion(correctAnswer);
    setOptions(options);
  };

  // Function to handle a user's selection
  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.romaji) {
      // Correct answer
      const randomIncrement = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      setScore(score + randomIncrement);
      setScoreChange(`+${randomIncrement}`);

      // Increase combo streak
      if (comboStreak + 1 === 10) {
        // When streak reaches 10, reset streak and give 1000 points
        setComboStreak(0);
        setScore(score + 1000);
        setScoreChange(`+1000 (Combo Reset!)`);
      } else {
        setComboStreak(comboStreak + 1);
      }
    } else {
      // Reset combo streak if answer is incorrect
      setComboStreak(0);
      setScoreChange(`Incorrect! The correct answer was ${currentQuestion.romaji}`);
    }

    // Generate a new question after 1 second
    setTimeout(generateNewQuestion, 200);

    // Fade out score change after 2 seconds
    setTimeout(() => {
      setScoreChange(null);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-6 text-white text-center">
      {/* Display the current Hiragana character with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 1 }}
  
        className="text-6xl font-bold mb-4 mt-10"
      >
        {currentQuestion ? currentQuestion.character : '...'}
      </motion.div>

      {/* Display score change (e.g., +500) */}
      {scoreChange && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -200 }} // Fade in
          exit={{ opacity: 0 }}    // Fade out
          transition={{ duration: 1 }} // Slow fade-out after 2 seconds
          key={score}               // Trigger re-render and animation when score changes
          className={`fixed z-50`}
        >
          {scoreChange}
        </motion.div>
      )}

      {/* Display options as clickable buttons side by side */}
      <div className="flex space-x-4 mt-10">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option.romaji)}
            className="flex-1 py-2 px-4 bg-stone-800 text-white rounded-md shadow-md hover:bg-stone-600 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            {option.romaji} 
          </motion.button>
        ))}
      </div>

      {/* Display score */}
      <div className="mt-4 text-lg text-white mt-10">
        <motion.p
          className="font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Fade out when the component leaves
          transition={{ duration: 1 }}
          key={score} // Trigger animation when score changes
        >
          スコア: {score}
        </motion.p>
      </div>
    </div>
  );
};

export default A;
