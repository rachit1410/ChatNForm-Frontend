import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatDB from "../components/ChatDB";
import FormDB from "../components/FormDB";
import Nav from "../components/Nav";

const Dashboard = function () {
  const [expandedSection, setExpandedSection] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Effect hook to synchronize the URL with the currently expanded section.
   * This ensures that the page path reflects the active view (e.g., /dashboard/chat or /dashboard/form).
   */
  useEffect(() => {
    if (expandedSection === 0 && location.pathname !== "/dashboard/chat") {
      navigate("/dashboard/chat", { replace: true });
    } else if (
      expandedSection === 1 &&
      location.pathname !== "/dashboard/form"
    ) {
      navigate("/dashboard/form", { replace: true });
    }
  }, [expandedSection, navigate, location.pathname]);

  return (
    // Main container with dark mode background and SVG pattern
    <div
      className="flex flex-col h-screen font-interr bg-gray-900 text-white"
    >
      {/* Navigation bar component */}
      <Nav
        expandedSection={expandedSection}
        setExpandedSection={setExpandedSection}
      />

      {/* Main content area, flex-1 ensures it takes up remaining vertical space */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conditional rendering based on the expandedSection state */}
        {expandedSection === 0 ? <ChatDB /> : <FormDB />}
      </div>
    </div>
  );
};

export default Dashboard;
