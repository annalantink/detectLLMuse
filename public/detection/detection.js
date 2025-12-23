function showPopup(reason) {
  console.log("Triggering popup due to:", reason);
  document.getElementById("detectionModal").style.display = "block";
}

function closePopup() {
  document.getElementById("detectionModal").style.display = "none";
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
      
      if (result.similarity >= 0.9) {
          showPopup("High cosine similarity detected");
      }

    } catch (err) {
      console.error("Detection failed:", err);
    }
  });
}