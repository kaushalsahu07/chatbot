import "./App.css";
import BotImg from "../public/image.png";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { CohereClient } from "cohere-ai";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scroll to the bottom of the chat
  const mesEnd = useRef(null);

  useEffect(() => {
    mesEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enter To Send Message
  const handleKey = async (e) => {
    if (e.key === "Enter") {
      await handleSend();
    }
  };

  // Initialize Cohere client with the API key
  const cohere = new CohereClient({
    token: import.meta.env.VITE_Api_Key,
  });

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);

      // Store User Input
      const userMessage = input;
      setInput("");

      try {
        // Loading message
        setMessages((prev) => [...prev, { text: "Typing...", sender: "bot" }]);

        // API Call to Cohere
        const response = await cohere.generate({
          model: "command",
          prompt: input,
          maxTokens: 100,
        });

        const data = response.generations[0].text;

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

  return (
    <>
      <div className="flex items-center justify-center bg-[#F5F5F5] min-h-screen p-4">
        <div className="relative w-full max-w-[40rem] h-[90vh] md:h-[80vh] bg-white rounded-xl shadow-[0px_0px_50px_-20px_rgba(59,_130,_246,_0.5)]">
          {/* Header */}
          <div className="bg-[#4A99E8] flex justify-center h-20 rounded-t-xl p-4">
            <div className="flex items-center gap-2">
              <img className="w-12 rounded-full" src={BotImg} alt="Bot" />
              <h1 className="text-white text-2xl font-bold">ChatBot</h1>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col h-[calc(100%-5rem)]">
            {/* Messages Area */}
            <div className="Chat-Dashboard flex-1 overflow-y-auto p-4 custom-scrollbar">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`${message.sender === "user" ? "hidden" : ""}`}
                  >
                    <img
                      className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full flex items-end"
                      src={BotImg}
                      alt="Bot"
                    />
                  </div>
                  <div
                    className={`${
                      message.sender === "user"
                        ? "bg-[#4A99E8] text-white rounded-bl-[10px] rounded-br-[0px]"
                        : "bg-[#F5F5F5] rounded-bl-[0px] rounded-br-[10px]"
                    } rounded-tl-[10px] rounded-tr-[10px] p-3 md:p-4 w-auto max-w-[80%] md:max-w-[70%]`}
                  >
                    <p className="text-xs md:text-sm">{message.text}</p>
                  </div>
                  <div ref={mesEnd}></div>
                </div>
              ))}
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 h-12 text-sm outline-none border-2 border-[#4A99E8] rounded-full px-4"
                />
                <button
                  className="bg-[#4A99E8] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  onClick={handleSend}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
