import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        fetchAndRender(user.uid);
    } else {
        window.location.href = '/';
    }
});

async function fetchAndRender(uid) {
    try {
        const snap = await getDocs(collection(db, `users/${uid}/logs`));
        let logs = [];
        snap.forEach(doc => logs.push(doc.data()));

        if (logs.length > 0) {
            logs.sort((a, b) => new Date(a.date) - new Date(b.date));
            const recentLogs = logs.slice(-14);
            // 🔥 Save latest stress for chatbot
            const last = recentLogs[recentLogs.length - 1];
            if (last && last.stress_score !== undefined) {
                let label = "Stable";
                if (last.stress_score == 2) label = "High";
                if (last.stress_score == 0) label = "Low";

                localStorage.setItem("lastStress", label);
            }
            const labels = recentLogs.map(l => l.date.split('-').reverse().slice(0,2).join('/'));

            // Graph 1: Stress Prediction
            new Chart(document.getElementById('chart-stress-detail'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Stress Index (0-Low, 2-High)',
                        data: recentLogs.map(l => l.stress_score ?? 0), // Use stress_score field
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Graph 2: Steps & Activity
            new Chart(document.getElementById('chart-steps-activity'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Daily Steps', data: recentLogs.map(l => l.steps), backgroundColor: '#10b981' },
                        { label: 'Activity', data: recentLogs.map(l => l.activity * 1000), type: 'line', borderColor: '#fbbf24' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Graph 3: Mood & Sleep (Adding this back)
            if(document.getElementById('chart-mood-sleep')) {
                new Chart(document.getElementById('chart-mood-sleep'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            { label: 'Mood', data: recentLogs.map(l => l.mood), borderColor: '#a855f7' },
                            { label: 'Sleep', data: recentLogs.map(l => l.sleep), borderColor: '#f43f5e' }
                        ]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }   
        }
    } catch (e) { console.error("Analysis Error:", e); }
}