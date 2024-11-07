import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Data: Hiragana characters and their corresponding Romaji
const hiraganaData = [
    { character: 'さ', romaji: 'sa' },
    { character: 'し', romaji: 'shi' },
    { character: 'す', romaji: 'su' },
    { character: 'せ', romaji: 'se' },
    { character: 'そ', romaji: 'so' }
  ];
  
  

// Function to shuffle an array (for randomizing the multiple choice options)
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

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

    // Get the correct answer and 3 random wrong answers
    const wrongAnswers = hiraganaData
      .filter((item) => item.romaji !== correctAnswer.romaji)
      .sort(() => Math.random() - 0.5) // Shuffle the wrong answers
      .slice(0, 3); // Take only 3 wrong answers

    // Combine correct answer with wrong answers and shuffle
    const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);

    setCurrentQuestion(correctAnswer);
    setOptions(allOptions);
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
    setTimeout(generateNewQuestion, 1000);

    // Fade out score change after 2 seconds
    setTimeout(() => {
      setScoreChange(null);
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-6 text-white text-center">

      {/* Display the current Hiragana character with animation */}
      <motion.div className="text-6xl font-bold mb-4 mt-10">
        {currentQuestion ? currentQuestion.character : '...'}
      </motion.div>

      {/* Display score change (e.g., +500) */}
      {scoreChange && (
        <motion.div
        initial={{ opacity: 0, y:0 }}
        animate={{ opacity: 1, y: -200 }} // Fade in
        exit={{ opacity: 0 }}    // Fade out
        transition={{ duration: 2 }} // Slow fade-out after 2 seconds
        key={score}               // Trigger re-render and animation when score changes
        className={`fixed z-50`}
      >
          {scoreChange}
        </motion.div>
      )}

      {/* Display options as clickable buttons */}
      <div className="transition space-y-4 mt-10 relative">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleAnswer(option.romaji)}
            className="w-full py-2 px-4 bg-stone-700 text-white rounded-md shadow-md hover:bg-stone-600 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            {option.romaji}
          </motion.button>
        ))}
      </div>

      {/* Display score */}
      <div className="mt-10 text-lg text-white">
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
