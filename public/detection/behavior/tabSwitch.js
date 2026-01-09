// Eventlistener for tab-switching

function detectTabSwitch(number) {
  document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
    } else {
      let currentCount = parseInt(sessionStorage.getItem(`tabswitchCount${number}`)) || 0;
      sessionStorage.setItem(`tabswitchCount${number}`, currentCount + 1);
      console.log(parseInt(sessionStorage.getItem(`tabswitchCount${number}`)) || 0);
    }
  });
}