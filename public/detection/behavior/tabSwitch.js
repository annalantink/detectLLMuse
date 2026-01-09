let tabChangeHandler;

function detectTabSwitch(number) {
  if (tabChangeHandler) stopDetectingTabSwitch();

  tabChangeHandler = () => {
    if (document.visibilityState === "hidden") {
      const key = `tabswitchCount${number}`;
      let currentCount = parseInt(sessionStorage.getItem(key)) || 0;
      sessionStorage.setItem(key, currentCount + 1);
      console.log(sessionStorage.getItem(key));
    }
  };

  document.addEventListener("visibilitychange", tabChangeHandler);
}

function stopDetectingTabSwitch() {
  if (tabChangeHandler) {
    document.removeEventListener("visibilitychange", tabChangeHandler);
    tabChangeHandler = null;
  }
}