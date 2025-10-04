import React from 'react';

// The main App component containing the complete loading screen.
// This is a self-contained, single-file component for easy use.
const Loading = () => {
  return (
    // Main container for the loading screen. It's a fixed element that covers the entire viewport.
    // We use a custom radial gradient for the background to create a deep, modern feel.
    // The classes below ensure it's centered, full-screen, and on top of all other content.
    <div className="min-h-screen flex items-center justify-center fixed inset-0 z-50 text-white
                    bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">

      {/* Container for the spinner and text, centered within the loading screen. */}
      <div className="flex flex-col items-center space-y-6">

        {/* The main spinner element. It is a rotating border that creates a sense of motion. */}
        <div className="relative w-24 h-24">
          
          {/* A background div that creates a subtle, glowing blur effect behind the main spinner.
              It uses a slow pulse animation for a gentle ebb and flow. */}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-75 blur-lg animate-pulse"></div>

          {/* The primary spinner element. A thin, transparent ring with a two-toned border.
              The border colors and a linear spin animation create the core loading effect. */}
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-700 border-l-blue-700 animate-spin"></div>
        </div>
        
        {/* The loading text. A simple message with a gentle pulsating animation. */}
        <div className="text-2xl font-semibold text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;