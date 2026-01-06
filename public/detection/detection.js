// === POP-UP MANAGER ===
function showPopup(reason) {
  if (WPM_MODAL_OPEN) return; // pop-up flag already active!
  WPM_MODAL_OPEN = true;
  let currentCount = parseInt(sessionStorage.getItem('number_popups')) || 0;
  sessionStorage.setItem('number_popups', currentCount + 1);

  console.log("Triggering popup due to:", reason);

  // defocus the text-area
  try {
    var active = document.activeElement;
    if (active && active.classList && active.classList.contains("input_summary")) {
      window.WPM_DETECTOR._prevFocus = active;
      active.blur();
    }
  } catch (e) { }

  document.getElementById("detectionModal").style.display = "block";

  // pause all detectors
  window.WPM_DETECTOR.pauseAll();
}

function closePopup() {
  document.getElementById("detectionModal").style.display = "none";
  WPM_MODAL_OPEN = false; // release flag
  console.log("Pop-up closed, resuming detection.");

  // reset all metrics when closing pop-up
  window.WPM_DETECTOR.resetAll();

  // unpause all detectors
  window.WPM_DETECTOR.resumeAll();
}

function setupDetection(textareaId, taskName) {
  const textarea = document.getElementById(textareaId);
  let lastCheckedLength = 0;

  textarea.addEventListener("input", async () => {
    const text = textarea.value;
    const length = text.length;

    if (length < 100) return;
    if (length - lastCheckedLength < 10) return;

    lastCheckedLength = length;

    try {
      const response = await fetch("/detect_content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, task: taskName })
      });

      const result = await response.json();
      
      if (result.similarity >= 0.88) {
          showPopup("High cosine similarity detected");
      }

    } catch (err) {
      console.error("Detection failed:", err);
    }
  });
}