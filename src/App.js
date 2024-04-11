import { useState } from "react";

const App = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    "Who won the latest Nobel Peace Prize?",
    "Where does pizza come from?",
    "Who is king of cricket?",
    "Who is the best cricket captian in the World?",
  ];

  const surprise = () => {
    const randpmValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randpmValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://geminiaichatbot.onrender.com/",
        options
      );
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later.");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me!
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Christmas...?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role}:{chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
