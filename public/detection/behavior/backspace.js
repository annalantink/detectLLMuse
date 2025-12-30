function backspaceDetector(el) {
    var numKeystrokes = 0
    var numBackspaces = 0

    el.addEventListener("keydown", function (e) {
        numKeystrokes += 1;
        if (e.code == "Backspace") numBackspaces += 1;
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
