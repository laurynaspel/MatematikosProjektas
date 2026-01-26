"use strict";

let currentLevel = "";
let score = 0;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const levels = {
  easy: {
    title: "🟢 Lengvas lygis",
    questions: [
      {
        text: "Kokia tai funkcija?",
        img: "../IMG/linear.png",
        answers: ["Laipsninė", "Tiesinė", "Šaknies"],
        correct: 1,
      },
      {
        text: "Atpažink funkciją pagal grafiką",
        img: "../IMG/sqrt.png",
        answers: ["Rodiklinė", "Šaknies", "Tiesinė"],
        correct: 1,
      },
      {
        text: "Kuri formulė yra tiesinė?",
        answers: ["y = x²", "y = √x", "y = ax + b"],
        correct: 2,
      },
      {
        text: "Kuri funkcija yra trigonometrinė?",
        answers: ["y = sin x", "y = x²", "y = log x"],
        correct: 0,
      },
      {
        text: "Kiek sprendinių gali turėti tiesinė lygtis?",
        answers: ["Du", "Begalybę", "Vieną"],
        correct: 2,
      },
    ],
  },

  medium: {
    title: "🟡 Vidutinis lygis",
    questions: [
      {
        text: "Kokia tai funkcija?",
        img: "../IMG/exp.png",
        answers: ["Laipsninė", "Rodiklinė", "Logaritminė"],
        correct: 1,
      },
      {
        text: "Koks grafikas pavaizduotas?",
        img: "../IMG/log.png",
        answers: ["Rodiklinė", "Šaknies", "Logaritminė"],
        correct: 2,
      },
      {
        text: "Kuri funkcija apibrėžta tik x ≥ 0?",
        answers: ["y = √x", "y = sin x", "y = x"],
        correct: 0,
      },
      {
        text: "Kuri funkcija auga greičiau?",
        answers: ["y = x", "y = 2ˣ", "y = √x"],
        correct: 1,
      },
      {
        text: "Kuri NĖRA tiesinė?",
        answers: ["y = 3x", "y = -x + 2", "y = x²"],
        correct: 2,
      },
    ],
  },

  hard: {
    title: "🔴 Sunkus lygis",
    questions: [
      {
        text: "Kuri funkcija periodinė?",
        img: "../IMG/sin.png",
        answers: ["Rodiklinė", "Trigonometrinė", "Logaritminė"],
        correct: 1,
      },
      {
        text: "Kuri funkcija yra atvirkštinė rodiklinei?",
        img: "../IMG/exp.png",
        answers: ["Laipsninė", "Tiesinė", "Logaritminė"],
        correct: 2,
      },
      {
        text: "Koks grafikas - parabolė?",
        answers: ["y = x²", "y = x", "y = log x"],
        correct: 0,
      },
      {
        text: "Kada logaritminė funkcija neegzistuoja?",
        answers: ["Kai x = 1", "Kai x ≤ 0", "Kai x > 0"],
        correct: 1,
      },
      {
        text: "Kuri funkcija didėja lėčiausiai?",
        answers: ["y = √x", "y = x", "y = 2ˣ"],
        correct: 0,
      },
    ],
  },
};

function startLevel(level) {
  currentLevel = level;
  score = 0;
  showScreen("quiz");

  document.getElementById("levelTitle").innerText = levels[level].title;
  const form = document.getElementById("quizForm");
  form.innerHTML = "";

  const questions = shuffle([...levels[level].questions]);

  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<h3>${i + 1}. ${q.text} (2 tšk.)</h3>`;

    if (q.img) {
      div.innerHTML += `<img src="${q.img}" alt="Grafikas">`;
    }

    q.answers.forEach((ans, idx) => {
      div.innerHTML += `
                <label>
                    <input type="radio" name="q${i}" value="${idx}">
                    ${ans}
                </label>
            `;
    });

    div.dataset.correct = q.correct;
    form.appendChild(div);
  });
}

function finishQuiz() {
  const questions = document.querySelectorAll(".question");
  questions.forEach((q, i) => {
    const checked = q.querySelector(`input[name="q${i}"]:checked`);
    if (checked && parseInt(checked.value) === parseInt(q.dataset.correct)) {
      score += 2;
    }
  });

  document.getElementById("scoreText").innerHTML =
    `Surinkai <b>${score}</b> iš <b>10</b> taškų`;
  showScreen("result");
}

function restart() {
  showScreen("start");
}

function nextLevel() {
  if (currentLevel === "easy") startLevel("medium");
  else if (currentLevel === "medium") startLevel("hard");
  else showScreen("start");
}

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
