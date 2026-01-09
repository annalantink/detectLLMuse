// Eventlistener for tab-switching
let tabChangeHandler;

function detectTabSwitch(number) {
  tabChangeHandler = () => {
    if (document.visibilityState !== "visible") {
      let currentCount = parseInt(sessionStorage.getItem(`tabswitchCount${number}`)) || 0;
      sessionStorage.setItem(`tabswitchCount${number}`, currentCount + 1);
    }
  };

  document.addEventListener("visibilitychange", tabChangeHandler);
}

function stopDetectingTabSwitch() {
  if (tabChangeHandler) {
    document.removeEventListener("visibilitychange", tabChangeHandler);
  }
}