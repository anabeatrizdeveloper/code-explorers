const totalLessons = ["Variables", "Loops", "Conditionals", "Debugging", "Where to Practice"];

function getExplorerData() {
  const savedData = localStorage.getItem("explorerCourseData");
  return savedData ? JSON.parse(savedData) : null;
}

function saveExplorerData(data) {
  localStorage.setItem("explorerCourseData", JSON.stringify(data));
}

function markLessonComplete(lessonName) {
  const explorerData = getExplorerData();

  if (!explorerData) {
    alert("Please start the Explorer Course first.");
    return;
  }

  if (!explorerData.completedLessons.includes(lessonName)) {
    explorerData.completedLessons.push(lessonName);
  }

  const finishedAllLessons = totalLessons.every((lesson) =>
    explorerData.completedLessons.includes(lesson)
  );

  if (finishedAllLessons && !explorerData.endDate) {
    explorerData.endDate = new Date().toLocaleDateString();
  }

  saveExplorerData(explorerData);
}

function updateWelcomeMessage() {
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (!welcomeMessage) return;

  const explorerData = getExplorerData();

  if (explorerData && explorerData.studentName) {
    welcomeMessage.textContent = `Welcome, ${explorerData.studentName}!`;
  }
}

function updateProgressUI() {
  const progressCount = document.getElementById("progressCount");
  const progressList = document.getElementById("progressList");
  const certificateStatus = document.getElementById("certificateStatus");

  if (!progressCount && !progressList && !certificateStatus) return;

  const explorerData = getExplorerData();

  if (!explorerData) return;

  const completed = explorerData.completedLessons || [];

  if (progressCount) {
    progressCount.textContent = `${completed.length} of ${totalLessons.length} lessons completed`;
  }

  if (progressList) {
    progressList.innerHTML = "";
    totalLessons.forEach((lesson) => {
      const item = document.createElement("li");
      const done = completed.includes(lesson);
      item.textContent = done ? `✅ ${lesson}` : `⬜ ${lesson}`;
      progressList.appendChild(item);
    });
  }

  if (certificateStatus) {
    const allDone = totalLessons.every((lesson) => completed.includes(lesson));
    certificateStatus.textContent = allDone
      ? "Your certificate is ready."
      : "Complete all lessons to unlock your certificate.";
  }
}

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
      completedLessons: []
    };

    saveExplorerData(explorerData);
    window.location.href = "course-home.html";
  });
}

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

function setupCertificatePage() {
  const certificateName = document.getElementById("certificateName");
  const certificateAge = document.getElementById("certificateAge");
  const certificateStart = document.getElementById("certificateStart");
  const certificateEnd = document.getElementById("certificateEnd");
  const certificateTopics = document.getElementById("certificateTopics");
  const certificateLocked = document.getElementById("certificateLocked");
  const certificateContent = document.getElementById("certificateContent");
  const downloadButton = document.getElementById("downloadCertificate");

  if (!certificateContent) return;

  const explorerData = getExplorerData();

  if (!explorerData) {
    certificateLocked.textContent = "Start the Explorer Course first.";
    certificateContent.style.display = "none";
    if (downloadButton) downloadButton.style.display = "none";
    return;
  }

  const allDone = totalLessons.every((lesson) =>
    explorerData.completedLessons.includes(lesson)
  );

  if (!allDone) {
    certificateLocked.textContent = "Complete all lessons to unlock the certificate.";
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

  if (certificateTopics) {
    certificateTopics.innerHTML = "";
    explorerData.completedLessons.forEach((lesson) => {
      const li = document.createElement("li");
      li.textContent = `• ${lesson}`;
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
updateWelcomeMessage();
updateProgressUI();
setupCertificatePage();