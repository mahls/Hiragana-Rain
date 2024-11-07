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
  
// Function to shuffle an array (for randomizing the multiple choice options)
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Ka = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
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
    setMessage('');
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
        setMessage('Streak Reached 10! +1000 Points 🎉');
      } else {
        setComboStreak(comboStreak + 1);
        setMessage('正解！🎉');
      }
    } else {
      // Reset combo streak if answer is incorrect
      setComboStreak(0);
      setMessage(`残念！正解は ${currentQuestion.romaji} です。`);
    }

    // Generate a new question after 1 second
    setTimeout(generateNewQuestion, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-6 text-white text-center">

      {/* Display the current Hiragana character with animation */}
      <motion.div
        className="text-6xl font-bold mb-4 mt-10 "
        opacity
      >
        {currentQuestion ? currentQuestion.character : '...'}
      </motion.div>

      {/* Display score change (e.g., +500) */}
      {scoreChange && (
        <motion.div
          className={`text-3xl mb-5 mt-10 ${scoreChange.includes('Combo Reset') ? 'text-yellow-500' : 'text-green-500'}`}
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0, y: 10 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          key={score} // Trigger re-render and animation when score changes
        >
          {scoreChange}
        </motion.div>
      )}

      {/* Display options as clickable buttons */}
      <div className="space-y-4 mt-10">
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
      <div className="mt-4 text-lg text-green">
        <motion.p
          className="font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Fade out when the component leaves
          transition={{ duration: 0.5 }}
          key={score} // Trigger animation when score changes
        >
          スコア: {score}
        </motion.p>
      </div>
    </div>
  );
};

export default Ka;

