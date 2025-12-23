const WINDOW_MS = 10000; // time window (10 seconds)
const MAX_PAUSE_MS = 1000; // max allowed pause (1 second)

// === PAUSE DETECTION ===
function pauseDetector(el) {

  let active = false;
  let timer = null;
  let lastTime = 0; // timestamp of last keystroke
  let maxGap = 0; // maximum gap between keystrokes

  // reset tracking window
  function resetWindow() {
    const now = Date.now();
    lastTime = now;
    maxGap = 0;
  }

  function onKey() {
    const now = Date.now();
    maxGap = Math.max(maxGap, now - lastTime);
    lastTime = now;
  }

  // check for pauses
  function checkWindow() {
    const now = Date.now();
    maxGap = Math.max(maxGap, now - lastTime);
    if (maxGap <= MAX_PAUSE_MS) showPopup("No pauses detected during typing.");
    resetWindow();
  }

  function start() {
    if (active) return;
    active = true;
    resetWindow();
    el.addEventListener("keydown", onKey);
    timer = setInterval(checkWindow, WINDOW_MS);
  }

  function stop() {
    active = false;
    el.removeEventListener("keydown", onKey);
    clearInterval(timer);
    timer = null;
  }

  el.addEventListener("focus", start); // start on focus
  el.addEventListener("blur", stop); // stop on blur
}

// === BOOTSTRAP ===
document.addEventListener("DOMContentLoaded", function () {
  var areas = document.querySelectorAll(".input_summary");
  areas.forEach(pauseDetector);
});
