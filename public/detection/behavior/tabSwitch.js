// Eventlistener for tab-switching
document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    console.log("tab is active");
  } else {
    console.log("tab is inactive");
  }
});