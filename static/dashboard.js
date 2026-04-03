import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const logModal = document.getElementById("log-modal");
const resultModal = document.getElementById("result-modal");
const resultBadge = document.getElementById("result-badge");
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const chatContent = document.getElementById("chat-content");
const healthScoreBar = document.getElementById("health-score-bar");

// UI Helpers
document.getElementById("open-log-modal").onclick = () => logModal.classList.replace("hidden", "flex");
document.getElementById("close-log-modal").onclick = () => logModal.classList.replace("flex", "hidden");
document.getElementById("chat-toggle").onclick = () => chatWindow.classList.toggle("hidden");
document.getElementById("logout-btn").onclick = async () => { await signOut(auth); window.location.href = "/"; };
document.getElementById("close-result-modal").onclick = () => { resultModal.classList.replace("flex", "hidden"); location.reload(); };

// Auth & Load Stats
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const q = query(collection(db, `users/${user.uid}/logs`), orderBy("timestamp", "desc"), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
            const d = snap.docs[0].data();
            document.getElementById("stat-sleep").innerText = d.sleep + "h";
            document.getElementById("stat-steps").innerText = d.steps.toLocaleString();
            document.getElementById("stat-mood").innerText = d.mood + "/10";
            document.getElementById("stat-stress").innerText = d.stress;
            
            // Update Consistency Bar
            let score = 0;
            if (d.sleep >= 7) score += 25;
            if (d.steps >= 6000) score += 25;
            if (d.mood >= 7) score += 25;
            if (d.stress !== "High") score += 25;
            healthScoreBar.style.width = score + "%";
        }
    } else { window.location.href = "/"; }
});

// CHATBOT: NO MORE HARDCODED MESSAGES
async function handleChat() {
    const msg = chatInput.value.trim();
    if(!msg) return;

    appendMsg("You", msg);
    chatInput.value = "";

    try {
        const res = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: msg, t: Date.now() }) // Unique request
        });
        const data = await res.json();
        
        // This will now only show response from Falcon AI (hf_client.py)
        appendMsg("AI", data.reply); 
    } catch(e) { 
        appendMsg("AI", "Server Error: Make sure app.py is running."); 
    }
}

document.getElementById("chat-send-btn").onclick = handleChat;
chatInput.onkeypress = (e) => { if(e.key === 'Enter') handleChat(); };

function appendMsg(s, t) {
    const div = document.createElement("div");
    div.className = "p-2 rounded bg-white/5 border border-white/10 mb-2";
    div.innerHTML = `<strong>${s}:</strong> ${t}`;
    chatContent.appendChild(div);
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Prediction Logic
document.getElementById("health-form").onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        sleep: parseFloat(document.getElementById("f-sleep").value),
        meal: parseInt(document.getElementById("f-meal").value),
        steps: parseInt(document.getElementById("f-steps").value),
        mood: parseInt(document.getElementById("f-mood").value),
        activity: parseInt(document.getElementById("f-activity").value),
        screen: parseFloat(document.getElementById("f-screen").value),
        date: document.getElementById("f-date").value
    };

    try {
        const res = await fetch('/predict', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (auth.currentUser) {
            await addDoc(collection(db, `users/${auth.currentUser.uid}/logs`), {
                ...payload,
                stress: result.stress,
                stress_score: result.stress === "High" ? 2 : (result.stress === "Stable" ? 1 : 0),
                timestamp: serverTimestamp()
            });
        }

        logModal.classList.replace("flex", "hidden");
        resultBadge.innerText = result.stress;
        resultBadge.className = "py-4 px-6 rounded-2xl text-2xl font-bold mb-6 text-white " + 
            (result.stress === "High" ? "bg-red-600" : (result.stress === "Low" ? "bg-green-600" : "bg-yellow-500"));
        resultModal.classList.replace("hidden", "flex");
    } catch (err) { alert("Backend Error!"); }
};