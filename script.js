// Display Student Name
document.getElementById("studentName").textContent = localStorage.getItem("username");

// Data Store
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

// DOM Elements
const subjectInput = document.getElementById("subjectInput");
const totalChapters = document.getElementById("totalChapters");
const subjectList = document.getElementById("subjectList");
const recommendationText = document.getElementById("recommendationText");
const motivationText = document.getElementById("motivationText");

// Add Subject Function
document.getElementById("addSubject").addEventListener("click", () => {
  const name = subjectInput.value.trim();
  const chapters = parseInt(totalChapters.value);

  if (name && chapters > 0) {
    subjects.push({ name, total: chapters, completed: 0 });
    localStorage.setItem("subjects", JSON.stringify(subjects));
    subjectInput.value = "";
    totalChapters.value = "";
    renderSubjects();
    updateChart();
  }
});

// Render Subject List
function renderSubjects() {
  subjectList.innerHTML = "";
  subjects.forEach((sub, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${sub.name}</b> - ${sub.completed}/${sub.total} chapters completed
      <button onclick="markComplete(${i})">+1 Complete</button>
    `;
    subjectList.appendChild(div);
  });
}

// Mark Chapter Complete (Pure FP)
function markComplete(i) {
  subjects = subjects.map((s, index) =>
    index === i && s.completed < s.total
      ? { ...s, completed: s.completed + 1 }
      : s
  );
  localStorage.setItem("subjects", JSON.stringify(subjects));
  renderSubjects();
  updateChart();
  showRecommendation();
}

// Progress Chart (Chart.js)
const ctx = document.getElementById("progressChart");
let chart;

function updateChart() {
  const labels = subjects.map(s => s.name);
  const data = subjects.map(s => (s.completed / s.total) * 100);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Progress (%)",
        data,
        backgroundColor: "#4a90e2"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// Recommendation (based on lowest progress)
function showRecommendation() {
  if (subjects.length === 0) {
    recommendationText.textContent = "Add subjects to get recommendations!";
    return;
  }
  const lowest = subjects.reduce((a, b) =>
    a.completed / a.total < b.completed / b.total ? a : b
  );
  recommendationText.textContent = `Focus more on ${lowest.name}, progress is low.`;
}

// Motivation Quotes
const quotes = [
  "Small steps daily lead to big success!",
  "Discipline is stronger than motivation.",
  "Stay consistent and results will follow.",
  "Don’t watch the clock; do what it does — keep going!"
];

function showMotivation() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  motivationText.textContent = random;
}

showMotivation();
renderSubjects();
updateChart();
showRecommendation();

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("subjects");
  window.location.href = "index.html";
});