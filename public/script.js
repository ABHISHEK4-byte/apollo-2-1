// Get elements
const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");

// 👤 Creator info for APOLLO 2.1 – change this to your details
const CREATOR_NAME = "Abhishek";  // <-- put your name
const CREATOR_ROLE = "Creator & Developer of APOLLO 2.1";
const CREATOR_IMAGE =
  "https://1drv.ms/i/c/83897f2ef4e86778/IQAmdITSp13xT7Auge2xYIpXAU6O_J2M70woDmgSMnKelho?e=7eVQ6K";        // <-- put a photo URL or leave as "" if you don't have

// Add a message to chat
function addMessage(text, sender = "bot", isHtml = false) {
  const div = document.createElement("div");
  div.classList.add("message", sender);

  if (isHtml) {
    div.innerHTML = text; // allow HTML (for image + styled text)
  } else {
    div.textContent = text; // normal plain text
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

// Show creator card (name + role + pic)
function showCreatorMessage() {
  let html = `
    <div style="display:flex;align-items:center;gap:10px;">
  `;

  if (CREATOR_IMAGE) {
    html += `
      <img src="${CREATOR_IMAGE}"
           alt="${CREATOR_NAME}"
           style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:1px solid #22c55e;" />
    `;
  }

  html += `
      <div>
        <strong>I was created by ${CREATOR_NAME}.</strong><br/>
        <span style="font-size:0.85rem;opacity:0.9;">${CREATOR_ROLE}</span>
      </div>
    </div>
  `;

  addMessage(html, "bot", true);
}

// First system message
addMessage(
  "You are chatting with APOLLO 2.1. Ask anything about studies, coding, exams, or ideas.",
  "system"
);

// Form submit = user sent a message
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  // 🔍 Check if user is asking who created APOLLO
  const lower = text.toLowerCase();
  if (
    lower.includes("who created you") ||
    lower.includes("who made you") ||
    lower.includes("who is your creator") ||
    lower.includes("who built you") ||
    lower.includes("who created apollo") ||
    lower.includes("who made apollo")
  ) {
    // Show user's question
    addMessage(text, "user");
    // Show your name + pic
    showCreatorMessage();
    inputEl.value = "";
    return; // don't send this to backend
  }
// 🔍 If user asks about creator's picture
if (
  lower.includes("show his picture") ||
  lower.includes("show his pic") ||
  lower.includes("do you have his picture") ||
  lower.includes("creator picture") ||
  lower.includes("creator pic") ||
  lower.includes("show creator picture") ||
  lower.includes("show creator pic")
) {
  addMessage(text, "user");
  showCreatorMessage(); // show your name + image again
  inputEl.value = "";
  return;
}

  // Normal flow: send to backend AI

  // Show user message
  addMessage(text, "user");
  inputEl.value = "";

  // Show 'Thinking...'
  const thinkingEl = document.createElement("div");
  thinkingEl.classList.add("message", "bot");
  thinkingEl.textContent = "Thinking...";
  chatEl.appendChild(thinkingEl);
  chatEl.scrollTop = chatEl.scrollHeight;

  inputEl.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    chatEl.removeChild(thinkingEl);

    if (!res.ok || !data.reply) {
      addMessage(data.error || "Something went wrong.", "bot");
    } else {
      addMessage(data.reply, "bot");
    }
  } catch (err) {
    console.error(err);
    chatEl.removeChild(thinkingEl);
    addMessage("Error connecting to APOLLO 2.1.", "bot");
  } finally {
    inputEl.disabled = false;
    inputEl.focus();
  }
});
