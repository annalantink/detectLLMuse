// Eventlistener for tab-switching
document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    console.log("tab is active");
  } else {
    console.log("tab is inactive");
    let currentCount = parseInt(sessionStorage.getItem('tab_switch')) || 0;
    sessionStorage.setItem('tab_switch', currentCount + 1);
  }
});