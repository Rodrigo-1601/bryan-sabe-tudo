const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-screen]");

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active-screen", screen.id === id));
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === id);
  });
  window.scrollTo(0, 0);
}

navButtons.forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.getElementById("startGame").addEventListener("click", () => showScreen("jogar"));

const facts = [
  {
    fact: "Polvos possuem três corações.",
    comment: "Dois já seriam exagero."
  },
  {
    fact: "Um dia em Vênus dura mais que um ano em Vênus.",
    comment: "Não recomendo marcar reunião lá."
  },
  {
    fact: "Wombats produzem cocô em formato de cubo.",
    comment: "A natureza tomou decisões."
  },
  {
    fact: "Bananas são bagas, botanicamente falando.",
    comment: "Seu conhecimento sobre salada de frutas acaba de piorar."
  },
  {
    fact: "Algumas tartarugas conseguem respirar parcialmente pela cloaca.",
    comment: "Eu não vou elaborar."
  },
  {
    fact: "O coração de um camarão fica na região da cabeça.",
    comment: "Finalmente alguém que pensa com o coração."
  },
  {
    fact: "A Torre Eiffel pode ficar alguns centímetros mais alta no calor.",
    comment: "Até monumento cresce no verão."
  },
  {
    fact: "Lontras-marinhas podem dar as mãos enquanto descansam na água.",
    comment: "Isso foi estranhamente fofo."
  }
];

let state = JSON.parse(localStorage.getItem("labBryanSave")) || {
  xp: 0,
  level: 1,
  facts: 0,
  didntKnow: 0,
  knew: 0,
  finger: 0,
  swear: 0,
  currentFact: -1
};

const dialogue = document.getElementById("dialogue");

function save() {
  localStorage.setItem("labBryanSave", JSON.stringify(state));
  updateStats();
}

function addXP(amount) {
  state.xp += amount;
  while (state.xp >= 100) {
    state.xp -= 100;
    state.level++;
    unlock(`NÍVEL ${state.level}!`, "Seu conhecimento inútil aumentou.");
  }
  save();
}

function updateStats() {
  document.getElementById("level").textContent = state.level;
  document.getElementById("xp").textContent = state.xp;
  document.getElementById("xpBar").style.width = `${state.xp}%`;
  document.getElementById("factsCount").textContent = state.facts;
  document.getElementById("didntKnowCount").textContent = state.didntKnow;
  document.getElementById("knewCount").textContent = state.knew;
  document.getElementById("fingerCount").textContent = state.finger;
  document.getElementById("swearCount").textContent = state.swear;
}

function unlock(title, text) {
  const box = document.getElementById("achievement");
  box.innerHTML = `<strong>🏆 ${title}</strong><br>${text}`;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 3200);
}

function nextFact() {
  let next;
  do {
    next = Math.floor(Math.random() * facts.length);
  } while (facts.length > 1 && next === state.currentFact);

  state.currentFact = next;
  state.facts++;
  const item = facts[next];
  dialogue.innerHTML = `VOCÊ SABIA?<br><br>${item.fact}<br><br><small>— ${item.comment}</small>`;
  addXP(2);
}

document.getElementById("nextFact").addEventListener("click", nextFact);

document.querySelectorAll("[data-reaction]").forEach(button => {
  button.addEventListener("click", () => {
    const reaction = button.dataset.reaction;

    if (reaction === "naoSabia") {
      state.didntKnow++;
      dialogue.textContent = "Eu sabia que você não sabia. +5 de conhecimento inútil.";
      addXP(5);
    }

    if (reaction === "jaSabia") {
      state.knew++;
      dialogue.textContent = "Já sabia? Tá se achando inteligente agora?";
      addXP(3);
    }

    if (reaction === "dedo") {
      state.finger++;

      // Nas primeiras vezes Bryan reclama.
      const normalReplies = [
        "Isso foi desnecessário.",
        "De novo?",
        "Eu estou tentando ensinar.",
        "Você tem algum problema comigo?"
      ];

      // A partir do 5º dedo, há 20% de chance de Bryan devolver.
      const bryanReturnsFinger = state.finger >= 5 && Math.random() < 0.20;

      if (bryanReturnsFinger) {
        dialogue.innerHTML = "Você sabia que eu também sei fazer isso?<br><br>🖕🤓";
        unlock("RESPEITO É BOM E EU GOSTO", "Bryan devolveu o dedo.");
      } else {
        dialogue.textContent = normalReplies[Math.min(state.finger - 1, normalReplies.length - 1)];
      }
      save();
    }

    if (reaction === "xingar") {
      state.swear++;
      const replies = [
        "Tá bom então.",
        "Nossa. Que aluno educado.",
        "Eu só falei uma curiosidade.",
        "Beleza. Você sabia que—"
      ];
      dialogue.textContent = replies[Math.floor(Math.random() * replies.length)];
      save();
    }
  });
});

/* ALUNOS
   Adicione quantos quiser. Depois substitua os placeholders por imagens reais. */
const students = [
  {
    name: "RODRIGO",
    className: "Designer",
    intelligence: 82,
    patience: 25,
    useless: 63,
    ability: "Photoshop +20",
    description: '"Entrou procurando conhecimento. Agora sabe fatos sobre polvos."'
  },
  {
    name: "ALUNO 02",
    className: "Especialista em nada",
    intelligence: 68,
    patience: 45,
    useless: 78,
    ability: "Ignorar o Bryan +15",
    description: '"Veio pela amizade. Ficou pelas informações desnecessárias."'
  },
  {
    name: "ALUNO 03",
    className: "Sobrevivente",
    intelligence: 74,
    patience: 12,
    useless: 91,
    ability: "Dar dedo crítico +30",
    description: '"Já ouviu curiosidades demais para voltar atrás."'
  }
];

let currentStudent = 0;

function renderStudent() {
  const s = students[currentStudent];
  document.getElementById("studentName").textContent = s.name;
  document.getElementById("studentClass").textContent = s.className;
  document.getElementById("studentIntelligence").style.width = `${s.intelligence}%`;
  document.getElementById("studentPatience").style.width = `${s.patience}%`;
  document.getElementById("studentUseless").style.width = `${s.useless}%`;
  document.getElementById("studentAbility").textContent = s.ability;
  document.getElementById("studentDescription").textContent = s.description;

  const dots = document.getElementById("studentDots");
  dots.innerHTML = students.map((_, i) =>
    `<span class="dot ${i === currentStudent ? "active" : ""}"></span>`
  ).join("");
}

document.getElementById("prevStudent").addEventListener("click", () => {
  currentStudent = (currentStudent - 1 + students.length) % students.length;
  renderStudent();
});

document.getElementById("nextStudent").addEventListener("click", () => {
  currentStudent = (currentStudent + 1) % students.length;
  renderStudent();
});

document.addEventListener("keydown", event => {
  if (!document.getElementById("alunos").classList.contains("active-screen")) return;
  if (event.key === "ArrowLeft") document.getElementById("prevStudent").click();
  if (event.key === "ArrowRight") document.getElementById("nextStudent").click();
});

updateStats();
renderStudent();
