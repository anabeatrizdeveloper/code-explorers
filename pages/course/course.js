// Lista de lições do curso
const totalLessons = [
  "Variables",
  "Loops",
  "Conditionals",
  "Debugging",
  "Where to Practice",
  "Sequences",
  "Input and Output"
];

// Lista de atividades de prática
const totalPracticeItems = [
  "variablesQuiz",
  "loopsQuiz",
  "conditionalsQuiz",
  "debuggingQuiz",
  "practiceQuiz",
  "sequencesQuiz",
  "inputOutputQuiz",
  "finalChallenge"
];

// Lê os dados salvos do curso
function getExplorerData() {
  const savedData = localStorage.getItem("explorerCourseData");
  return savedData ? JSON.parse(savedData) : null;
}

// Salva os dados atualizados do curso
function saveExplorerData(data) {
  localStorage.setItem("explorerCourseData", JSON.stringify(data));
}

// Cria estrutura padrão caso algum campo ainda não exista
function normalizeExplorerData(data) {
  if (!data.completedLessons) data.completedLessons = [];
  if (!data.scores) data.scores = {};
  if (!data.totalScore) data.totalScore = 0;
  if (!data.endDate) data.endDate = "";
  return data;
}

// Marca uma lição como concluída
function markLessonComplete(lessonName) {
  let explorerData = getExplorerData();

  if (!explorerData) {
    alert("Please start the Explorer Course first.");
    return;
  }

  explorerData = normalizeExplorerData(explorerData);

  if (!explorerData.completedLessons.includes(lessonName)) {
    explorerData.completedLessons.push(lessonName);
  }

  const finishedAllLessons = totalLessons.every((lesson) =>
    explorerData.completedLessons.includes(lesson)
  );

  const finishedAllPractice = totalPracticeItems.every((item) =>
    Object.prototype.hasOwnProperty.call(explorerData.scores, item)
  );

  if (finishedAllLessons && finishedAllPractice && !explorerData.endDate) {
    explorerData.endDate = new Date().toLocaleDateString();
  }

  saveExplorerData(explorerData);
}

// Salva a pontuação de uma atividade
function savePracticeScore(practiceKey, scoreValue) {
  let explorerData = getExplorerData();

  if (!explorerData) {
    alert("Please start the Explorer Course first.");
    return;
  }

  explorerData = normalizeExplorerData(explorerData);

  // Salva a nota da atividade
  explorerData.scores[practiceKey] = scoreValue;

  // Recalcula a pontuação total
  let total = 0;
  Object.values(explorerData.scores).forEach((value) => {
    total += Number(value);
  });

  explorerData.totalScore = total;

  const finishedAllLessons = totalLessons.every((lesson) =>
    explorerData.completedLessons.includes(lesson)
  );

  const finishedAllPractice = totalPracticeItems.every((item) =>
    Object.prototype.hasOwnProperty.call(explorerData.scores, item)
  );

  if (finishedAllLessons && finishedAllPractice && !explorerData.endDate) {
    explorerData.endDate = new Date().toLocaleDateString();
  }

  saveExplorerData(explorerData);
}

// Exibe o nome da criança na home do curso
function updateWelcomeMessage() {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (!welcomeMessage) return;

  const explorerData = getExplorerData();
  if (explorerData && explorerData.studentName) {
    welcomeMessage.textContent = `Welcome, ${explorerData.studentName}!`;
  }
}

// Atualiza a UI de progresso
function updateProgressUI() {
  const progressCount = document.getElementById("progressCount");
  const progressList = document.getElementById("progressList");
  const certificateStatus = document.getElementById("certificateStatus");
  const scoreStatus = document.getElementById("scoreStatus");

  if (!progressCount && !progressList && !certificateStatus && !scoreStatus) return;

  let explorerData = getExplorerData();
  if (!explorerData) return;

  explorerData = normalizeExplorerData(explorerData);

  const completedLessons = explorerData.completedLessons || [];
  const completedPracticeCount = Object.keys(explorerData.scores).length;

  if (progressCount) {
    progressCount.textContent =
      `${completedLessons.length} of ${totalLessons.length} lessons completed · ` +
      `${completedPracticeCount} of ${totalPracticeItems.length} practice activities completed`;
  }

  if (progressList) {
    progressList.innerHTML = "";

    totalLessons.forEach((lesson) => {
      const item = document.createElement("li");
      const done = completedLessons.includes(lesson);
      item.textContent = done ? `✅ Lesson: ${lesson}` : `⬜ Lesson: ${lesson}`;
      progressList.appendChild(item);
    });

    totalPracticeItems.forEach((practiceKey) => {
      const item = document.createElement("li");
      const done = Object.prototype.hasOwnProperty.call(explorerData.scores, practiceKey);
      item.textContent = done ? `⭐ Practice: ${practiceKey}` : `⬜ Practice: ${practiceKey}`;
      progressList.appendChild(item);
    });
  }

  if (scoreStatus) {
    scoreStatus.textContent = `Explorer Score: ${explorerData.totalScore}`;
  }

  if (certificateStatus) {
    const allDoneLessons = totalLessons.every((lesson) => completedLessons.includes(lesson));
    const allDonePractice = totalPracticeItems.every((item) =>
      Object.prototype.hasOwnProperty.call(explorerData.scores, item)
    );

    certificateStatus.textContent =
      allDoneLessons && allDonePractice
        ? "Your certificate is ready."
        : "Complete all lessons and practice activities to unlock your certificate.";
  }
}

// Configura o formulário inicial do curso
function setupExplorerForm() {
  const explorerForm = document.getElementById("explorer-form");
  if (!explorerForm) return;

  explorerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const studentAge = document.getElementById("studentAge").value.trim();

    if (!studentName || !studentAge) {
      alert("Please fill in your name and age.");
      return;
    }

    const explorerData = {
      studentName,
      studentAge,
      startDate: new Date().toLocaleDateString(),
      endDate: "",
      completedLessons: [],
      scores: {},
      totalScore: 0
    };

    saveExplorerData(explorerData);
    window.location.href = "course-home.html";
  });
}

// Configura botões de concluir lição
function setupCompleteButtons() {
  const completeButtons = document.querySelectorAll(".complete-button");
  const lessonMessage = document.getElementById("lessonMessage");

  if (!completeButtons.length) return;

  completeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lessonName = button.dataset.lesson;
      markLessonComplete(lessonName);

      if (lessonMessage) {
        lessonMessage.textContent = `${lessonName} was marked as complete!`;
      }
    });
  });
}

// Configura formulários de prática
function setupPracticeForms() {
  const practiceForm = document.querySelector(".practice-form");
  const practiceMessage = document.getElementById("practiceMessage");

  if (!practiceForm) return;

  practiceForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const practiceKey = practiceForm.dataset.practice;
    const correctAnswer = practiceForm.dataset.answer;
    const selectedOption = practiceForm.querySelector('input[name="quiz-option"]:checked');

    if (!selectedOption) {
      if (practiceMessage) {
        practiceMessage.textContent = "Please choose an answer first.";
      }
      return;
    }

    const isCorrect = selectedOption.value === correctAnswer;
    const scoreValue = isCorrect ? 1 : 0;

    savePracticeScore(practiceKey, scoreValue);

    if (practiceMessage) {
      practiceMessage.textContent = isCorrect
        ? "Great job! Your answer is correct."
        : "Nice try! Your answer was saved. Keep learning and exploring.";
    }
  });
}

// Configura o desafio final
function setupFinalChallenge() {
  const finalForm = document.getElementById("finalChallengeForm");
  const finalMessage = document.getElementById("finalMessage");

  if (!finalForm) return;

  finalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let score = 0;

    // Corrige cada questão do desafio final
    for (let i = 1; i <= 5; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && selected.dataset.correct === "true") {
        score += 1;
      }
    }

    savePracticeScore("finalChallenge", score);

    if (finalMessage) {
      finalMessage.textContent = `Great work! You scored ${score} out of 5 in the Final Challenge.`;
    }
  });
}

// Configura o certificado
function setupCertificatePage() {
  const certificateName = document.getElementById("certificateName");
  const certificateAge = document.getElementById("certificateAge");
  const certificateStart = document.getElementById("certificateStart");
  const certificateEnd = document.getElementById("certificateEnd");
  const certificateTopics = document.getElementById("certificateTopics");
  const certificateLocked = document.getElementById("certificateLocked");
  const certificateContent = document.getElementById("certificateContent");
  const downloadButton = document.getElementById("downloadCertificate");
  const certificateScore = document.getElementById("certificateScore");

  if (!certificateContent) return;

  let explorerData = getExplorerData();

  if (!explorerData) {
    certificateLocked.textContent = "Start the Explorer Course first.";
    certificateContent.style.display = "none";
    if (downloadButton) downloadButton.style.display = "none";
    return;
  }

  explorerData = normalizeExplorerData(explorerData);

  const allDoneLessons = totalLessons.every((lesson) =>
    explorerData.completedLessons.includes(lesson)
  );

  const allDonePractice = totalPracticeItems.every((item) =>
    Object.prototype.hasOwnProperty.call(explorerData.scores, item)
  );

  if (!allDoneLessons || !allDonePractice) {
    certificateLocked.textContent = "Complete all lessons and practice activities to unlock the certificate.";
    certificateContent.style.display = "none";
    if (downloadButton) downloadButton.style.display = "none";
    return;
  }

  certificateLocked.textContent = "";
  certificateContent.style.display = "block";

  if (certificateName) certificateName.textContent = explorerData.studentName;
  if (certificateAge) certificateAge.textContent = explorerData.studentAge;
  if (certificateStart) certificateStart.textContent = explorerData.startDate;
  if (certificateEnd) certificateEnd.textContent = explorerData.endDate || new Date().toLocaleDateString();
  if (certificateScore) certificateScore.textContent = explorerData.totalScore;

  if (certificateTopics) {
    certificateTopics.innerHTML = "";
    explorerData.completedLessons.forEach((lesson) => {
      const li = document.createElement("li");
      li.textContent = lesson;
      certificateTopics.appendChild(li);
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      window.print();
    });
  }
}

setupExplorerForm();
setupCompleteButtons();
setupPracticeForms();
setupFinalChallenge();
updateWelcomeMessage();
updateProgressUI();
setupCertificatePage();