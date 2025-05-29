import axios from "axios";
import { useEffect, useState } from "react";

const ChatSessionSidebar = ({ token, onSessionSelect, activeSessionId }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchSessions = async () => {
      try {
        const res = await axios.get(
          `https://backendoftradegpt-production.up.railway.app/api/chat/user-sessions/?token=${token}`
        );
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    };

    fetchSessions();
  }, [token]);

  return (
    <div className="bg-[#1a1f2c] w-72 text-white p-4 border-r border-[#3a3a4c]">
      <h3 className="text-lg font-bold mb-4">Chat History</h3>
      <ul className="space-y-2">
        {sessions.map((session) => (
          <li
            key={session.session_id}
            onClick={() => onSessionSelect(session.session_id)}
            className={`cursor-pointer p-2 rounded hover:bg-[#2a2f3c] ${
              activeSessionId === session.session_id ? "bg-[#2a2f3c]" : ""
            }`}
          >
            Session: {new Date(session.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSessionSidebar;
