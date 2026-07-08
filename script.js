const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("userInput");

const defaultDataset = [
  {
    question: "hello",
    answer: "Hi there! I'm ChatBoot. What would you like to talk about today?"
  },
  {
    question: "how are you",
    answer: "I'm doing great, thanks! I'm ready to help with your questions."
  },
  {
    question: "what can you do",
    answer: "I can answer simple questions, help with ideas, and chat with you."
  },
  {
    question: "tell me about yourself",
    answer: "I'm a small chat assistant built to demo a web-based AI-style chatbot."
  },
  {
    question: "help",
    answer: "Sure! Ask me anything, and I'll do my best to help you out."
  },
  {
    question: "thank you",
    answer: "You're welcome! If there's anything else, just type it in."
  }
];

let dataset = [...defaultDataset];

window.addEventListener("DOMContentLoaded", () => {
  userInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  fetch("dataset.json")
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        dataset = data;
      }
    })
    .catch(error => {
      console.error("Failed to load dataset.json:", error);
      dataset = [...defaultDataset];
    });
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";
  userInput.focus();

  const reply = getBotResponse(text);
  setTimeout(() => appendMessage(reply, "bot"), 300);
}

function appendMessage(message, role) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  bubble.innerHTML = `
    <div class="role">${role === "user" ? "You" : "ChatBoot"}</div>
    <div class="text">${escapeHtml(message)}</div>
  `;

  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getBotResponse(input) {
  const normalized = input.toLowerCase();

  if (dataset.length > 0) {
    const match = dataset.find(item => {
      if (typeof item.question === "string" && typeof item.answer === "string") {
        return normalized.includes(item.question.toLowerCase());
      }
      return false;
    });

    if (match) {
      return match.answer;
    }
  }

  const fallbackResponses = [
    "I\'m here to help — tell me more.",
    "That sounds interesting. Can you say a bit more?",
    "I don\'t have an exact answer yet, but I can help you explore the idea.",
    "Let\'s keep chatting! What would you like to ask next?"
  ];

  if (/(hi|hello|hey|greetings)/i.test(input)) {
    return "Hello there! I\'m ChatBoot. How can I help you today?";
  }

  if (/(help|support|assist|question)/i.test(input)) {
    return "Sure — ask me anything, and I\'ll do my best to answer.";
  }

  if (/(thanks|thank you|ty)/i.test(input)) {
    return "You\'re welcome! If you have another question, just send it.";
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}