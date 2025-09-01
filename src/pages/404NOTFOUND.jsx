import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Main NOTFOUND component
const NOTFOUND = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [glitchText, setGlitchText] = useState("404");
  const baseText = "404";

  // State to hold the user's mouse position for interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // A class-based approach for the Particle object
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `hsl(210, 80%, 75%)`; // A cool blue-purple hue
    }

    update(mousePosition, canvas) {
      // Add a force based on the mouse position for interactivity
      const dx = mousePosition.x - this.x;
      const dy = mousePosition.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x -= (dx / dist) * 0.1;
        this.y -= (dy / dist) * 0.1;
      }

      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap particles around the screen
      if (this.x > canvas.width || this.x < 0) this.x = Math.random() * canvas.width;
      if (this.y > canvas.height || this.y < 0) this.y = Math.random() * canvas.height;
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    if (!container) return;

    let particles = [];
    const numParticles = 100;

    // Adjust canvas size to match the container
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    // Initialize particles
    const init = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mousePosition, canvas); // Pass dependencies
        particles[i].draw(ctx); // Pass dependency
      }
      requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    // Initial setup
    resizeCanvas();
    init();
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mousePosition]); // Re-run effect when mouse position changes

  // Handles mouse movement to update the mouse position state
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Glitch effect on mouse enter and leave
  const handleMouseEnter = () => {
    let interval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let newText = "";
      for (let i = 0; i < baseText.length; i++) {
        newText += chars[Math.floor(Math.random() * chars.length)];
      }
      setGlitchText(newText);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setGlitchText(baseText);
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-gray-950 text-gray-200 font-inter flex items-center justify-center min-h-screen relative overflow-hidden"
    >
      {/* Background canvas for the particle animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {/* Main content container */}
      <div className="relative z-10 text-center space-y-6 p-8 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 shadow-xl max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
        
        {/* The interactive glitchy text */}
        <h1
          onMouseEnter={handleMouseEnter}
          className="text-8xl md:text-9xl lg:text-[15rem] font-extrabold transition-all duration-200 cursor-pointer select-none text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 animate-pulse-slow"
        >
          {glitchText}
        </h1>

        <div className="space-y-4">
          <p className="text-xl md:text-2xl font-light text-gray-300">
            Oops! It seems the page you're looking for doesn't exist.
          </p>

          <p className="text-sm md:text-base text-gray-400 max-w-xs mx-auto">
            Don't worry, even our best bots get lost sometimes. Let's get you back on track.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <button
            onClick={() => navigate("/")}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Go Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default NOTFOUND;
