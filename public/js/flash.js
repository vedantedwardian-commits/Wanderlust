document.querySelectorAll(".flashAutoDismiss").forEach((flashAlert) => {
  setTimeout(() => {
    flashAlert.classList.add("fadeOut");
    flashAlert.addEventListener("transitionend", () => flashAlert.remove(), {
      once: true,
    });
  }, 4000);
});
