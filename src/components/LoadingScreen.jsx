
import "./loadingChat.css";

export default function LoadingScreen() {
  return (
    <div className="loader-container" role="status" aria-busy="true" aria-label="Loading chat">
      <div className="bg-bubbles" aria-hidden="true">
        <div className="bg-bubble b1"></div>
        <div className="bg-bubble b2"></div>
        <div className="bg-bubble b3"></div>
        <div className="bg-bubble b4"></div>
      </div>

      <div className="chat-bubble" aria-hidden="false">
        <div className="letters" aria-hidden="true" title="CNF">
          <span>C</span><span>N</span><span>F</span>
        </div>
        <div className="typing-dots" aria-hidden="true" title="Typing">
          <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        </div>
      </div>
    </div>
  );
}
