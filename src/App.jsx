import "./App.css";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CohereClient } from "cohere-ai";

const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a haiku about coding",
  "What's the best way to learn React?",
  "Tell me a fun science fact",
];

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);

  // Scroll to the bottom of the chat
  const mesEnd = useRef(null);

  useEffect(() => {
    mesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enter To Send Message
  const handleKey = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  // Initialize Cohere client with the API key
  const cohere = new CohereClient({
    token: import.meta.env.VITE_Api_Key,
  });

  const handleSend = async (overrideText = null) => {
    const messageText = overrideText ?? input;
    if (messageText.trim()) {
      setMessages((prev) => [...prev, { text: messageText, sender: "user" }]);

      // Store User Input
      setInput("");

      try {
        // Loading message
        setMessages((prev) => [...prev, { text: "Typing...", sender: "bot" }]);

        // API Call to Cohere
        const response = await cohere.chat({
          model: "command-a-03-2025",
          message: messageText,
          preamble: "Your name is Nova AI, you are a helpful assistant, you will answer the user's question in a concise manner.",
          maxTokens: 100,
        });

        const data = response.text;

        //Filter Loading Message and Add Bot Response
        setMessages((prev) => [
          ...prev.filter((msg) => msg.text !== "Typing..."),
          { text: data, sender: "bot" },
        ]);
      } catch (error) {
        // Handle error
        console.error("Error generating response:", error);
        setMessages((prev) => [
          ...prev.filter((msg) => msg.text !== "Typing..."),
          { text: "Sorry, I couldn't process your request.", sender: "bot" },
        ]);
      }
    }
  };

  const isWelcome = messages.length === 1;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* Top branding bar */}
      <div className="flex items-center gap-3 px-6 py-4 flex-shrink-0">
        <div className="w-12 h-12 flex rounded-xl bg-indigo-100 items-center justify-center">
          <span className="text-[2rem] text-indigo-500 ">✦</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-sm leading-tight">Nova AI</h2>
          <p className="text-xs text-gray-400">Always ready to help</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {isWelcome ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 shadow-sm">
              <span className="text-4xl text-indigo-500 select-none leading-none">✦</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">How can I help you?</h1>
            <p className="text-gray-400 text-sm mb-8 text-center">Ask me anything or try a suggestion below</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-600 text-left hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-150 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat messages */
          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-4 py-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl text-indigo-500 select-none leading-none">✦</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm max-w-[75%] leading-relaxed ${
                      message.sender === "user"
                        ? "bg-indigo-500 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={mesEnd} />
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="px-2 pb-5 pt-3 flex-shrink-0">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white border-2 border-indigo-200 rounded-2xl px-4 py-3 focus-within:border-indigo-400 transition-colors shadow-sm">
              <textarea
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                className="flex-1 resize-none outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent max-h-32"
              />
              <button
                onClick={() => handleSend()}
                className="w-9 h-9 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Nova AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
