var WPM_THRESHOLD = 45;
var WPM_LOG_INTERVAL = 1000;
var WPM_LOG_COOLDOWN = 10000;
var THROTTLE = 200;

var DEBUG_WPM_LOG = true; // [DEBUG] logs WPM in the console if enabled
var DEBUG_LOG_INTERVAL = 1000;

var WPM_SUSTAIN_MS = 10000; // 45 WPM must be sustained for 10s


function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length; // non-empty strings
}

function computeWpm(el, startTs) {
    var text = el.value || '';
    var words = countWords(text);
    var elapsed = (Date.now() - startTs) / 1000;
    var wpm = 0;

    if (elapsed >= 1) { // edge case: avoid high WPM at the very start
        wpm = Math.round((words / elapsed) * 60);
        if (!isFinite(wpm)) wpm = 0;
    }
    
    return { wpm: wpm, words: words, elapsed: Math.round(elapsed) };
}

function initTextarea(el) {
    var started = false;
    var startTs = null; // starting timestamp
    var lastUpdate = 0; 
    var lastLoggedTs = 0;
    var updaterInterval = null;
    var debugInterval = null;
    var thresholdCounter = null; // how long WPM >= threshold

    function update(debug) {
        if (!started) return;
        var metrics = computeWpm(el, startTs);

        // wait 1s to avoid huge WPM
        if (metrics.elapsed < 1) return;

        var nowTs = Date.now();

        // sustained WPM check (>= 45 for 10 seconds)
        if (metrics.wpm >= WPM_THRESHOLD) {
            if (thresholdCounter === null) thresholdCounter = nowTs;

            if ((nowTs - thresholdCounter) >= WPM_SUSTAIN_MS) {
                if (nowTs - lastLoggedTs > WPM_LOG_COOLDOWN) {
                    console.log('[WPM Detector] High WPM detected:', metrics);
                    lastLoggedTs = nowTs;
                }
            }
        } else {
            // reset the sustain timer once WPM drops below threshold
            thresholdCounter = null;
        }

        // [DEBUG] logging.
        if (debug) console.log('[WPM Debug] WPM update:', metrics);
    }

    el.addEventListener('input', function () {
        if (!started) {
            started = true;
            startTs = Date.now();
            startIntervals();
        }

        var now = Date.now();
        if (now - lastUpdate > THROTTLE) {
            lastUpdate = now;
            update();
        } else {
            window.clearTimeout(el._wpm_timer);
            el._wpm_timer = window.setTimeout(update, THROTTLE + 10);
        }
    });

    window.addEventListener('beforeunload', function () {
        pauseInterval()
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            pauseInterval()
        } else {
            if (started) startIntervals();
        }
    });

    function startIntervals() {
        if (!updaterInterval) updaterInterval = window.setInterval(update, WPM_LOG_INTERVAL);
        if (DEBUG_WPM_LOG && !debugInterval) debugInterval = window.setInterval(function () { update(true); }, DEBUG_LOG_INTERVAL);
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

    function pauseInterval() {
        update();
        stopIntervals();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll('.input_summary');
    areas.forEach(initTextarea);
});
