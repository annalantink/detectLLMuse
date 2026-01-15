// Function to detect the number of backspaces hit while typing a summary
function backspaceDetector(el) {
    var numKeystrokes = 0
    var numBackspaces = 0

    // Event listener that tracks keystrokes
    el.addEventListener("keydown", function (e) {
        numKeystrokes += 1;
        if (e.code == "Backspace") numBackspaces += 1;

        // If the number of keystrokes is sufficiently high and the proportion of backspaces is less than 2% -> activate pop-up
        if (numKeystrokes >= 150 && numBackspaces / numKeystrokes < 0.02) {
            numBackspaces = 0;
            numKeystrokes = 0;
            showPopup("Too few backspaces during typing");
        };
    });
}

// === BOOTSTRAP ===
document.addEventListener("DOMContentLoaded", function () {
  var areas = document.querySelectorAll(".input_summary");
  areas.forEach(backspaceDetector);
});
