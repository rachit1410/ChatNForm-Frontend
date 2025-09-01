import React, { useState, useEffect, useRef } from 'react';

const FormDB = () => {
  const [clicks, setClicks] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [cps, setCps] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  const gameDuration = 5; // Game duration in seconds
  const maxCps = 12; // Maximum clicks per second for a perfect score

  const startGame = () => {
    setClicks(0);
    setTimeElapsed(0);
    setScore(0);
    setCps(0);
    setGameActive(true);
  };

  const handleClick = () => {
    if (gameActive) {
      setClicks(prevClicks => prevClicks + 1);
    }
  };

  useEffect(() => {
    if (gameActive) {
      // Start the timer only when the game is active
      timerRef.current = setInterval(() => {
        setTimeElapsed(prevTime => {
          const newTime = prevTime + 0.1;
          if (newTime >= gameDuration) {
            // End the game
            setGameActive(false);
            const calculatedCps = clicks / gameDuration;
            setCps(calculatedCps);
            const calculatedScore = Math.min(Math.round((calculatedCps / maxCps) * 100), 100);
            setScore(calculatedScore);
            return gameDuration; // Set final time
          }
          return newTime;
        });
      }, 100);
    } else {
      // Clean up the timer when the game is not active
      clearInterval(timerRef.current);
    }

    // Cleanup function to clear the timer when the component unmounts or game ends
    return () => clearInterval(timerRef.current);
  }, [gameActive, clicks, gameDuration, maxCps]);

  const progress = (timeElapsed / gameDuration) * 100;

  return (
    <div className=" min-w-full flex items-center justify-center min-h-screen bg-gray-900 bg-[url('/bg-dark.svg')] bg-center bg-cover text-white p-4 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .animate-pop {
            animation: pop 0.2s ease-in-out;
        }
      `}</style>
      <div className="flex flex-col items-center text-center max-w-2xl w-full p-8 md:p-12 bg-gray-800 rounded-3xl shadow-2xl backdrop-blur-sm bg-opacity-40 animate-fade-in">
        <div className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-500 to-pink-400 mb-4 animate-bounce-slow">
          Coming Soon
        </div>
        <p className="text-lg md:text-xl text-gray-300 mb-8 font-inter">
          Test your speed! How many times can you click in 5 seconds?
        </p>

        {/* Game Section */}
        <div className="w-full flex flex-col items-center mt-6">
          {!gameActive && score === 0 ? (
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Start Game!
            </button>
          ) : gameActive ? (
            <>
              <div className="text-4xl font-bold text-gray-200 mb-4 animate-pop">{clicks}</div>
              <button
                onClick={handleClick}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-100 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-300 w-full max-w-sm"
              >
                Click!
              </button>
              <div className="relative w-full max-w-sm h-4 bg-gray-700 rounded-full mt-4 overflow-hidden shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-pink-400 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Time Remaining: { (gameDuration - timeElapsed).toFixed(1) }s
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                Your Score: <span className="text-green-400">{score}/100</span>
              </div>
              <div className="text-lg text-gray-300 mb-4">
                You clicked <span className="text-white font-bold">{cps.toFixed(2)}</span> times per second.
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 font-inter mt-10">
          © {new Date().getFullYear()} Our Company. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default FormDB;
