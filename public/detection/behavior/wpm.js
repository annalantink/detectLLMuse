var WPM_THRESHOLD = 120;
var WPM_LOG_INTERVAL = 1000;
var WPM_LOG_COOLDOWN = 10000;
var THROTTLE = 200;

var DEBUG_WPM_LOG = true; // [DEBUG] logs WPM in the console if enabled
var DEBUG_LOG_INTERVAL = 1000; 


function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length; // non-empty strings
}

function initTextarea(el) {
    var started = false;
    var startTs = null; // starting timestamp
    var lastUpdate = 0; 
    var lastLoggedTs = 0;
    var updaterInterval = null;
    var debugInterval = null;

    function update(forceLog) {
        if (!started) return;
        var now = Date.now();
        var text = el.value || '';
        var words = countWords(text);

        // wait 1s to avoid huge WPM
        var elapsedSec = (now - startTs) / 1000;
        if (elapsedSec < 1) return; 

        var wpm = Math.round((words / elapsedSec) * 60);
        if (!isFinite(wpm)) wpm = 0;

        // WPM is too much!
        // TODO: Maybe reset WPM to cap after the trigger hits?
        if (wpm > WPM_THRESHOLD) {
            var nowTs = Date.now();
            if (nowTs - lastLoggedTs > WPM_LOG_COOLDOWN) {
                console.log('[WPM Detector] High WPM detected:', { wpm: wpm, words: words});
                lastLoggedTs = Date.now();
            }
        }
        // [DEBUG] logging. 
        if (forceLog) console.log('[WPM Debug] WPM update:', { wpm: wpm, words: words, elapsed: Math.round(elapsedSec)});
    }

    el.addEventListener('input', function () {
        if (!started) {
            started = true;
            startTs = Date.now();
            if (!updaterInterval) updaterInterval = window.setInterval(update, WPM_LOG_INTERVAL);
            if (DEBUG_WPM_LOG && !debugInterval) debugInterval = window.setInterval(function () { update(true); }, DEBUG_LOG_INTERVAL);
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

    // cleanup on unload
    window.addEventListener('beforeunload', function () {
        update();
        if (updaterInterval) {
            window.clearInterval(updaterInterval);
            updaterInterval = null;
        }
        if (debugInterval) {
            window.clearInterval(debugInterval);
            debugInterval = null;
        }
    });

    // pauses wpm when tab is not visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            update();
            if (updaterInterval) {
                window.clearInterval(updaterInterval);
                updaterInterval = null;
            }
            if (debugInterval) {
                window.clearInterval(debugInterval);
                debugInterval = null;
            }
        } else {
            // resume
            if (started && !updaterInterval) updaterInterval = window.setInterval(update, WPM_LOG_INTERVAL);
            if (DEBUG_WPM_LOG && started && !debugInterval) debugInterval = window.setInterval(function () { update(true); }, DEBUG_LOG_INTERVAL);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll('.input_summary');
    areas.forEach(initTextarea);
});
