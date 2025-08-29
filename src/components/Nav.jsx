import { BookPlus, ClipboardPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddGroup } from "../features/chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { urlHelper } from "../utilities/utils";

const Nav = function ({ expandedSection, setExpandedSection }) {
  const dispatch = useDispatch();
  const addGroup = useSelector((state) => state.chat.addGroup);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const profile = user.profile_image
    ? `${urlHelper.getBaseUrl()}${user.profile_image}`
    : `https://placehold.co/128x128/333333/FFFFFF?text=${
        user?.name ? user.name[0] : "P"
      }`;

  const handleNavigateTOMyAccount = () => {
    navigate("/account");
  };

  const handleAddGroup = () => {
    if (!addGroup) {
      dispatch(toggleAddGroup());
    }
  };

  const toggleSection = (sectionIndex) => {
    if (expandedSection !== sectionIndex) {
      setExpandedSection(
        expandedSection === sectionIndex ? null : sectionIndex
      );
    }
  };

  const section1Classes = expandedSection === 0 ? "flex-grow" : "w-20";
  const section2Classes = expandedSection === 1 ? "flex-grow" : "w-20";

  return (
    <div className="relative">
      {/* Actual nav bar */}
      <div className="flex w-full p-2 items-center justify-between bg-gray-800 text-white shadow-xl rounded-xl mx-auto my-3 max-w-7xl font-sans gap-2">
        {/* Left Section */}
        <div className="flex items-center justify-between bg-gray-300 transition-all duration-300 ease-in-out cursor-pointer rounded-xl shadow-md transform hover:scale-105" onClick={() => navigate("/")}>
          <img
            src="/ChatGPT_Image_Aug_20__2025__01_22_16_PM-removebg-preview.png"
            alt="CNF Logo"
            className="w-15 h-15"
          />
        </div>
        <div
          className={`flex items-center justify-between p-3 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white transition-all duration-300 ease-in-out ${section1Classes} cursor-pointer rounded-xl shadow-md transform hover:scale-105`}
          onClick={() => toggleSection(0)}
        >
          <span className="font-bold text-lg">
            {expandedSection === 0 ? "ChatNF" : "CNF"}
          </span>
          {expandedSection === 0 && (
            <div className="flex space-x-3">
              <button
                className="flex items-center space-x-2 px-4 py-1 rounded-full bg-transparent border-2 border-emerald-500 text-emerald-200 hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer shadow-md"
                onClick={handleAddGroup}
              >
                <BookPlus className="w-5 h-5" />
                <span>New Group</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div
          className={`flex items-center justify-between p-3 bg-gradient-to-r from-red-500 to-red-700 text-white transition-all duration-300 ease-in-out ${section2Classes} cursor-pointer rounded-xl shadow-md transform hover:scale-105`}
          onClick={() => toggleSection(1)}
        >
          {expandedSection === 1 ? (
            <>
              <span className="font-bold text-lg">CNForm</span>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-1 rounded-full bg-transparent border-2 border-red-500 text-red-200 hover:bg-red-700 hover:text-white transition-colors cursor-pointer shadow-md">
                  <ClipboardPlus className="w-5 h-5" />
                  <span>New Form</span>
                </button>
              </div>
            </>
          ) : (
            <span className="font-bold text-lg">CNF</span>
          )}
        </div>
        <div
          className="flex items-center justify-between p-2 bg-gray-700 text-white transition-all duration-300 ease-in-out cursor-pointer rounded-xl shadow-md transform hover:scale-105"
          onClick={handleNavigateTOMyAccount}
        >
          <img src={profile} alt="profile image" className="w-11 h-11 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Nav;