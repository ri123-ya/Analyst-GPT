import { useState } from "react";
import {
  Upload,
  FileText,
  X,
  Send,
  Paperclip,
  Bot,
  User,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  // AUTH STATE
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Upload a document and ask me anything about it.",
      sender: "bot",
      time: "10:30 AM",
    },
  ]);
  const [input, setInput] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `Document uploaded: **${file.name}**`,
          sender: "system",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `I found this in your document: "${input}"`,
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 800);
  };
  const handleSignOut = () => {
    setIsLoggedIn(false);
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-montserrat">
      {/* LEFT SIDEBAR - Document Upload */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Analyst GPT</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload & analyze your files
          </p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Upload Area - PURPLE */}
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-purple-400 rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 transition"
          >
            <Upload className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-sm font-medium text-purple-700">
              Click to upload document
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT</p>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Uploaded File */}
          {selectedFile && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">History</h3>
            {[
              "Summarize this document",
              "Find key points",
              "Explain in simple terms",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="w-full text-left text-sm p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition border border-transparent hover:border-purple-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE - Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Document Assistant
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {/* DASHBOARD */}
                {/* <Link
                  to="/dashboard"
                  className="px-4 py-1.5 text-purple-700 text-sm font-medium bg-white border border-purple-700 rounded-lg hover:bg-purple-50 transition"
                >
                  Dashboard
                </Link> */}

                {/* SIGN OUT */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-white text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition shadow-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-white text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition shadow-sm"
                >
                  Login
                </Link>

                {/* SIGN UP */}
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-purple-700 text-sm font-medium bg-white border border-purple-700 rounded-lg hover:bg-purple-50 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-lg ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${
                    msg.sender === "user"
                      ? "bg-gray-700"
                      : msg.sender === "bot"
                      ? "bg-purple-600"
                      : "bg-gray-500"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white"
                      : msg.sender === "bot"
                      ? "bg-white text-gray-800 border border-gray-200"
                      : "bg-gray-100 text-gray-600 text-sm"
                  }`}
                >
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about your document..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
