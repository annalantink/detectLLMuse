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
        const response = await fetch("/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            task: taskName
          })
        });
  
        const result = await response.json();
        console.log(`Detection (${taskName}, ${length} chars):`, result);

        if (result.similarity >= 0.9) {
            console.log("Pop up needs to be shown");
            // Insert popup logic here
        }
  
      } catch (err) {
        console.error("Detection failed:", err);
      }
    });
  }
  