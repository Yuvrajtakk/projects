const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSA2cV0BNgkKzevrcpJhCcHPwzh0hXH8Bg9LOzXs06jBkfsUeudjzziZWyo37h1Hy1iq_clnQa3iMB/pub?output=csv";

let questions = [];
let current = 0;
let score = 0;

async function loadQuestions() {
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const rows = text.trim().split("\n");
  const headers = rows.shift().split(",");
  
  questions = rows.map(r => {
    const cols = r.split(",");
    return {
      question: cols[1],
      options: [cols[2], cols[3], cols[4], cols[5]],
      correct: cols[6].split(";"), // handles multi answers
      type: cols[7]
    };
  });
  
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }
  
  const q = questions[current];
  
  document.getElementById("question-box").innerText = q.question;
  
  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  
  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = (q.type === "multiple" ? "checkbox" : "radio");
    checkbox.name = "option";
    checkbox.value = String.fromCharCode(65 + i);
    
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + opt));
    optionsList.appendChild(li);
  });
}

function calculateScore() {
  const q = questions[current];
  const selected = [];
  const inputs = document.querySelectorAll("#options-list input");
  
  inputs.forEach(i => {
    if (i.checked) selected.push(i.value);
  });
  
  const correct = q.correct.map(c => c.trim());
  if (q.type === "single") {
    if (selected[0] === correct[0]) score++;
  } else {
    if (selected.sort().join(",") === correct.sort().join(",")) score++;
  }
}

function nextQuestion() {
  calculateScore();
  current++;
  showQuestion();
}

function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result-box").style.display = "block";
  document.getElementById("score-text").innerText = `You scored: ${score} / ${questions.length}`;
}

document.getElementById("next-btn").addEventListener("click", nextQuestion);

window.onload = loadQuestions;