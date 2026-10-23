(() => {
  const menu = document.querySelector(".nav-menu");
  if (!menu) return;

  // Close the profile menu on outside click or Escape
  document.addEventListener("click", (e) => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu.open = false;
  });
})();
