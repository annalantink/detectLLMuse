// Eventlistener for tab-switching
document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
  } else {
    let currentCount = parseInt(sessionStorage.getItem('tab_switch')) || 0;
    sessionStorage.setItem('tab_switch', currentCount + 1);
    console.log(parseInt(sessionStorage.getItem('tab_switch')) || 0);
  }
});