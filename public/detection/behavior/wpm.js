// === CONFIG ===
var WPM_THRESHOLD = 45;
var WPM_LOG_INTERVAL = 1000;
var THROTTLE = 200;
var WPM_SUSTAIN_MS = 10000; // 45 WPM must be sustained for 10s
var WPM_MODAL_OPEN = false; // pop-up state

var DEBUG_WPM_LOG = false;
var DEBUG_LOG_INTERVAL = 1000;

// === METRICS ===
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function computeWpm(typedWords, elapsedSeconds) {
  var wpm = 0;

  if (elapsedSeconds >= 1) {
    wpm = Math.round((typedWords / elapsedSeconds) * 60);
    if (!isFinite(wpm)) wpm = 0;
  }

  return { wpm: wpm, words: typedWords, elapsed: Math.round(elapsedSeconds) };
}

// === DETECTOR MANAGER ===
(function initDetectorRegistry() {
  if (window.WPM_DETECTOR) return;

  var detectors = [];
  
	// control API
  window.WPM_DETECTOR = {
    register: function (api) {
      detectors.push(api);
    },
    pauseAll: function () {
      detectors.forEach(function (d) {
        if (d && typeof d.pause === "function") d.pause();
      });
    },
    resumeAll: function () {
      detectors.forEach(function (d) {
        if (d && typeof d.resume === "function") d.resume();
      });
    },
    resetAll: function () {
      detectors.forEach(function (d) {
        if (d && typeof d.reset === "function") d.reset();
      });
    }
  };
})();

// === TEXTAREA DETECTORS ===
function initTextarea(el) {
  var started = false;

  // time stuff
  var typedWords = 0; // typed word count
  var lastWords = 0; // word count at last input event

  var activeMs = 0; // active elapsed time (ms)
  var activeStartTs = null; // starting timestamp of active session
  
  var lastUpdate = 0; // timestamp of last WPM update
  var thresholdCounter = null; // active-time timestamp (ms) when WPM first goes >= threshold

  // interval timers
  var updaterInterval = null;
  var debugInterval = null;

  function getActiveNowMs() {
    var ms = activeMs;
    if (activeStartTs !== null) ms += (Date.now() - activeStartTs);
    return ms;
  }

  function startActiveClock() {
    if (activeStartTs === null) activeStartTs = Date.now();
  }

  function stopActiveClock() {
    if (activeStartTs !== null) {
      activeMs += (Date.now() - activeStartTs);
      activeStartTs = null;
    }
  }

  // main WPM update logic
  function update(debug) {
    if (!started) return;
    if (WPM_MODAL_OPEN) return;

    var activeNowMs = getActiveNowMs();
    var metrics = computeWpm(typedWords, activeNowMs / 1000);
    if (metrics.elapsed < 1) return; // wait 1s to avoid huge WPM at the very start
    

    if (metrics.wpm >= WPM_THRESHOLD) {
      if (thresholdCounter === null) thresholdCounter = activeNowMs;

      if ((activeNowMs - thresholdCounter) >= WPM_SUSTAIN_MS) {
        // console.log("[WPM Detector] High WPM detected:", metrics);
        showPopup("Sustained High Typing Speed");
        thresholdCounter = null;
      }
    } else {
      thresholdCounter = null;
    }

    // if (debug && !WPM_MODAL_OPEN) console.log("[WPM Debug] WPM update:", metrics);
  }

  function startIntervals() {
    if (!updaterInterval) updaterInterval = window.setInterval(update, WPM_LOG_INTERVAL);
    if (DEBUG_WPM_LOG && !debugInterval) {
      debugInterval = window.setInterval(function () { update(true); }, DEBUG_LOG_INTERVAL);
    }
  }

  function stopIntervals() {
    if (updaterInterval) {
      window.clearInterval(updaterInterval);
      updaterInterval = null;
    }
    if (debugInterval) {
      window.clearInterval(debugInterval);
      debugInterval = null;
    }
  }

  function pause() {
    stopActiveClock();
    update();
    stopIntervals();
  }

  function resume() {
    if (!started || WPM_MODAL_OPEN) return;
    startActiveClock();
    startIntervals();
  }

  // reset session counter
  function reset() {
    started = true;
    typedWords = 0;
    lastWords = countWords(el.value || "");
    activeMs = 0;
    activeStartTs = Date.now(); // begin active clock immediately on reset (if visible)
    thresholdCounter = null;
  }
  el.resetWpm = reset;

  // event listeners
  el.addEventListener("input", function () {
    if (WPM_MODAL_OPEN) return;

    if (!started) {
      started = true;
      typedWords = 0;
      lastWords = countWords(el.value || "");
      activeMs = 0;
      activeStartTs = Date.now();

      startIntervals();
    } else {
      startActiveClock();
    }

    // track only words ADDED + ignore deletions
    var currentWords = countWords(el.value || "");
    var delta = currentWords - lastWords;
    if (delta > 0) typedWords += delta;
    lastWords = currentWords;

    var now = Date.now();
    if (now - lastUpdate > THROTTLE) {
      lastUpdate = now;
      update();
    } else {
      window.clearTimeout(el._wpm_timer);
      el._wpm_timer = window.setTimeout(update, THROTTLE + 10);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  window.addEventListener("beforeunload", function () {
    pause();
  });

  // update registry
  window.WPM_DETECTOR.register({
    pause: pause,
    resume: resume,
    reset: reset
	});

}

// === BOOTSTRAP ===
document.addEventListener("DOMContentLoaded", function () {
  var areas = document.querySelectorAll(".input_summary");
  areas.forEach(initTextarea);
});
