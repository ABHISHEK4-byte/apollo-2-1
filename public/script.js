// =======================
// 1. FIREBASE AUTH SETUP
// =======================
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACLHuKEThzKuAd1dWAM1eGttZFud_aC-w",
  authDomain: "apollo-2-1.firebaseapp.com",
  projectId: "apollo-2-1",
  storageBucket: "apollo-2-1.firebasestorage.app",
  messagingSenderId: "34783584862",
  appId: "1:34783584862:web:ff896b91472a5adeb20acf",
  measurementId: "G-F8Z49E2XW8"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


// =======================
// 2. BASIC ELEMENTS
// =======================

const chatEl = document.getElementById("chat");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");

const appEl = document.getElementById("app");

// Settings / modal elements (optional)
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const settingsClose = document.getElementById("settings-close");

const signupModal = document.getElementById("signup-modal");
const signupSave = document.getElementById("signup-save");
const signupClose = document.getElementById("signup-close");

// =======================
// 3. CREATOR INFO
// =======================

const CREATOR_NAME = "Abhishek";
const CREATOR_ROLE = "Founder & Creator of APOLLO 2.1";
const CREATOR_IMAGE =
  "https://1drv.ms/i/c/83897f2ef4e86778/IQAmdITSp13xT7Auge2xYIpXAU6O_J2M70woDmgSMnKelho?e=7eVQ6K";

// Only update founder-inline if it exists (so no crash)
const founderInline = document.getElementById("founder-inline");
if (founderInline) {
  founderInline.textContent = CREATOR_NAME;
}

// =======================
// 4. MESSAGE HELPERS
// =======================

function addMessage(text, sender = "bot", isHtml = false) {
  const div = document.createElement("div");
  div.classList.add("message", sender);

  if (isHtml) {
    div.innerHTML = text;
  } else {
    div.textContent = text;
  }

  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function showCreatorMessage() {
  let html = `<div style="display:flex;align-items:center;gap:10px;">`;

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

function showCreatorPhotoOnly() {
  if (!CREATOR_IMAGE) {
    addMessage("I don't have a photo URL set for my creator yet.", "bot");
    return;
  }

  const html = `
    <div style="display:flex;flex-direction:column;gap:6px;">
      <span style="font-size:0.85rem;opacity:0.9;">Here is my creator 👇</span>
      <img src="${CREATOR_IMAGE}"
           alt="${CREATOR_NAME}"
           style="width:140px;height:140px;border-radius:18px;object-fit:cover;border:1px solid #22c55e;" />
    </div>
  `;
  addMessage(html, "bot", true);
}

function showHelp() {
  const html = `
    <div style="font-size:0.88rem;">
      <strong>Here are some things you can try:</strong><br/><br/>
      <code>/help</code> – show this help<br/>
      <code>/creator</code> – who created APOLLO 2.1<br/>
      <code>/photo</code> – show creator photo<br/>
      <code>/mood</code> – random vibe message<br/>
      Or just ask normal questions like:<br/>
      • "Explain stack in C in simple words"<br/>
      • "Make me a 5-mark answer on OS deadlock"<br/>
      • "Give me ideas for a mini project"
    </div>
  `;
  addMessage(html, "bot", true);
}

function showRandomMood() {
  const moods = [
    "Today’s vibe: grind now, flex later 😎",
    "Small steps > no steps. You’re doing fine. ✨",
    "Sip water. Fix posture. Open VS Code. We move 💻",
    "APOLLO 2.1 believes in you more than your alarm clock does 😆",
  ];
  const pick = moods[Math.floor(Math.random() * moods.length)];
  addMessage(pick, "bot");
}

// Initial system message
addMessage(
  "You are chatting with APOLLO 2.1. Try /help to see special commands.",
  "system"
);

// =======================
// 5. CHAT HANDLER
// =======================

if (formEl && inputEl && chatEl) {
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    const lower = text.toLowerCase();

    // creator questions
    if (
      lower.includes("who created you") ||
      lower.includes("who made you") ||
      lower.includes("who is your creator") ||
      lower.includes("who built you") ||
      lower.includes("who created apollo") ||
      lower.includes("who made apollo")
    ) {
      addMessage(text, "user");
      showCreatorMessage();
      inputEl.value = "";
      return;
    }

    // picture questions
    if (
      lower.includes("do you have his picture") ||
      lower.includes("show his picture") ||
      lower.includes("show his pic") ||
      lower.includes("creator picture") ||
      lower.includes("creator photo") ||
      lower.includes("show creator picture") ||
      lower.includes("show creator pic")
    ) {
      addMessage(text, "user");
      showCreatorPhotoOnly();
      inputEl.value = "";
      return;
    }

    // slash commands
    if (lower === "/help") {
      addMessage(text, "user");
      showHelp();
      inputEl.value = "";
      return;
    }

    if (lower === "/creator") {
      addMessage(text, "user");
      showCreatorMessage();
      inputEl.value = "";
      return;
    }

    if (lower === "/photo") {
      addMessage(text, "user");
      showCreatorPhotoOnly();
      inputEl.value = "";
      return;
    }

    if (lower === "/mood") {
      addMessage(text, "user");
      showRandomMood();
      inputEl.value = "";
      return;
    }

    // normal AI flow
    addMessage(text, "user");
    inputEl.value = "";

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
}

// =======================
// 6. SIMPLE MODALS (SETTINGS + DEMO SIGNUP)
// =======================

function openModal(el) {
  if (!el) return;
  el.classList.add("active");
}

function closeModal(el) {
  if (!el) return;
  el.classList.remove("active");
}

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => openModal(settingsModal));
}
if (settingsClose) {
  settingsClose.addEventListener("click", () => closeModal(settingsModal));
}

if (signupModal) {
  // These are for the small demo signup modal (NOT Firebase auth)
  if (signupSave) {
    signupSave.addEventListener("click", () => {
      closeModal(signupModal);
      addMessage(
        "Signup saved (demo). In a real version your account would be created. 😉",
        "bot"
      );
    });
  }
  if (signupClose) {
    signupClose.addEventListener("click", () => closeModal(signupModal));
  }
}

// =======================
// 7. CLEAN AUTH SYSTEM
// =======================

// Auth card + forms
const authCard = document.getElementById("auth-card");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");

const loginBtn = document.getElementById("login-btn");
const signupBtnAuth = document.getElementById("signup-btn");
const showSignupBtn = document.getElementById("show-signup");
const showLoginBtn = document.getElementById("show-login");
const authMsg = document.getElementById("auth-message");

function setAuthMessage(text, isError = false) {
  if (!authMsg) return;
  authMsg.textContent = text;
  authMsg.style.color = isError ? "#f97373" : "#4ade80";
}

// Switch login <-> signup
showSignupBtn?.addEventListener("click", () => {
  if (!loginForm || !signupForm) return;
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  setAuthMessage("");
});

showLoginBtn?.addEventListener("click", () => {
  if (!loginForm || !signupForm) return;
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  setAuthMessage("");
});

// SIGNUP HANDLER
signupBtnAuth?.addEventListener("click", async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (!email || !password) {
    setAuthMessage("Enter email and password.", true);
    return;
  }

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    setAuthMessage("Account created. You are logged in!");
  } catch (err) {
    console.error(err);
    setAuthMessage(err.message, true);
  }
});

// LOGIN HANDLER
loginBtn?.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    setAuthMessage("Enter email and password.", true);
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    setAuthMessage("Logged in successfully!");
  } catch (err) {
    console.error(err);
    setAuthMessage(err.message, true);
  }
});

// Keep UI synced with auth state
auth.onAuthStateChanged((user) => {
  if (!authCard || !appEl) return;

  if (user) {
    authCard.style.display = "none";
    appEl.style.display = "flex";
  } else {
    authCard.style.display = "block";
    appEl.style.display = "none";
  }
});
