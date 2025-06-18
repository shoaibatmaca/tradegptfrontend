import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileModal from "./UserProfileModal";

// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
const BACKEND_URL = "https://backendoftradegpt-production.up.railway.app";
const LeftSidebar = ({
  collapsed,
  toggleSidebar,
  onNavItemClick,
  activeSection,
  // setLoadSessionId,
}) => {
  // const [activeItem, setActiveItem] = useState("dashboard");

  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;

    fetch(`${BACKEND_URL}/api/chat/user-sessions/?token=${token}`)
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch((err) => console.error("Failed to fetch sessions", err));
  }, []);
  const handleNavItemClick = (item) => {
    if (onNavItemClick) {
      onNavItemClick(item);
    }

    // Add route navigation here
    if (item === "intro") {
      navigate("/intro");
    }
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleUserClick = () => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      // const decoded = jwt_decode(token);
      const decoded = jwtDecode(token);

      setUserInfo(decoded);
      setShowProfileModal(true);
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <div
      className={`bg-sidebar-bg text-primary-text h-screen flex flex-col sticky top-0 overflow-y-auto transition-all duration-300 ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <i className="bi bi-bar-chart-fill text-2xl mr-2"></i>
            <h3 className="font-bold m-0">TradeGPT</h3>
          </div>
        )}
      </div>

      <div className="p-3 border-b border-gray-700">
        {!collapsed ? (
          <div className="flex items-center bg-input-bg rounded-md bg-[#2c3e50] h-[46px]">
            <span className="p-2 text-secondary-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="bg-transparent border-0 text-primary-text p-2 focus:outline-none w-full"
              placeholder="Search"
            />
          </div>
        ) : (
          <div className="flex justify-center text-secondary-text">
            <i className="bi bi-search"></i>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto left-sidebar-content">
        <ul className="p-2 list-item">
          <li
            className={`p-2 rounded-md cursor-pointer flex items-center bg-[#413e3e] h-[52px] ${
              activeSection === "dashboard" ? "" : ""
            }`}
            onClick={() => handleNavItemClick("dashboard")}
          >
            <i className="bi bi-grid-fill mr-3"></i>
            {!collapsed && <span>Dashboard</span>}
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer flex items-center ${
              activeSection === "prompts" ? "" : ""
            }`}
            onClick={() => handleNavItemClick("prompts")}
          >
            <i className="bi bi-lightbulb-fill mr-3"></i>
            {!collapsed && <span>Recommended Prompts</span>}
          </li>
        </ul>

        <div className="text-xs font-semibold text-secondary-text uppercase p-2">
          {!collapsed && <span>Your Chats</span>}
        </div>

        <ul className="p-2 list-item space-y-1">
          {sessions.map((session) => (
            <li
              key={session.session_id}
              className={`p-2 rounded-md cursor-pointer flex items-center text-sm hover:bg-[#2c3e50] ${
                activeSection === session.session_id ? "bg-[#3b3b3b]" : ""
              }`}
              onClick={() => handleNavItemClick(session.session_id)}
            >
              <i className="bi bi-chat-dots-fill mr-2 text-base"></i>
              {!collapsed && (
                <span>
                  Chat{" "}
                  {new Date(session.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </li>
          ))}
        </ul>
        {/* <ul className="p-2 list-item space-y-1">
          {sessions.map((session) => (
            <li
              key={session.session_id}
              className={`p-2 rounded-md cursor-pointer flex items-center text-sm hover:bg-[#2c3e50] ${
                activeSection === session.session_id ? "bg-[#3b3b3b]" : ""
              }`}
              onClick={() => {
                handleNavItemClick(session.session_id);
                // setLoadSessionId(session.session_id); // ✅ FIXED
              }}
            >
              <i className="bi bi-chat-dots-fill mr-2 text-base"></i>
              {!collapsed && (
                <span>
                  Chat{" "}
                  {new Date(session.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </li>
          ))}
        </ul> */}

        <ul className="p-2 list-item">
          <li
            className={`p-2 rounded-md cursor-pointer flex items-center ${
              activeSection === "today" ? "" : ""
            }`}
            onClick={() => handleNavItemClick("today")}
          >
            <i className="bi bi-calendar-day mr-3"></i>
            {!collapsed && <span>Today</span>}
          </li>
          <li
            className={`p-2 rounded-md cursor-pointer flex items-center ${
              activeSection === "past" ? "" : ""
            }`}
            onClick={() => handleNavItemClick("past")}
          >
            <i className="bi bi-calendar-range mr-3"></i>
            {!collapsed && <span>Over 30 Days Ago</span>}
          </li>
        </ul>

        <div className="p-4 mt-4">
          {!collapsed && (
            <span className="inline-block bg-primary-accent text-primary-text text-xs px-2 py-1 rounded">
              GUIDE
            </span>
          )}
          <div
            className={`p-2 mt-2 rounded-md cursor-pointer flex items-center ${
              activeSection === "intro" ? "" : ""
            }`}
            onClick={() => handleNavItemClick("intro")}
          >
            <i className="bi bi-info-circle-fill mr-3"></i>
            {!collapsed && <span>Intro to TradeGPT</span>}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleUserClick}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-600">
            {userInfo?.profile_photo ? (
              <img
                src={userInfo.profile_photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className=" w-full h-full flex items-center justify-center text-secondary-text">
                <i className="bi bi-person-circle"></i>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="ml-2">
              <div className="text-sm font-medium text-primary-text">
                {userInfo ? userInfo.username : "Loading..."}
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && (
        <UserProfileModal
          userInfo={userInfo}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default LeftSidebar;
