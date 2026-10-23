(() => {
  const categories = document.querySelectorAll(".category");
  const rows = document.querySelectorAll(".listing-row");
  const emptyFilter = document.querySelector(".home-empty--filter");

  // ── Category filter ──────────────────────────────
  const applyFilter = (button) => {
    categories.forEach((c) => c.classList.toggle("is-active", c === button));
    const keywords = button.dataset.keywords.split(",").filter(Boolean);
    let anyVisible = false;

    rows.forEach((row) => {
      let rowVisible = false;
      row.querySelectorAll(".stay").forEach((stay) => {
        const match = !keywords.length || keywords.some((k) => stay.dataset.search.includes(k));
        stay.hidden = !match;
        if (match) rowVisible = true;
      });
      row.hidden = !rowVisible;
      if (rowVisible) anyVisible = true;
    });

    if (emptyFilter) emptyFilter.hidden = anyVisible || !rows.length;
  };

  categories.forEach((c) => c.addEventListener("click", () => applyFilter(c)));

  const reset = document.querySelector("[data-reset]");
  if (reset && categories[0]) reset.addEventListener("click", () => applyFilter(categories[0]));

  // ── Row carousels ────────────────────────────────
  rows.forEach((row) => {
    const track = row.querySelector(".row-track");
    row.querySelectorAll(".row-arrow").forEach((arrow) => {
      arrow.addEventListener("click", () => {
        track.scrollBy({ left: Number(arrow.dataset.dir) * track.clientWidth * 0.9, behavior: "smooth" });
      });
    });
  });

  // ── Inspiration tabs ─────────────────────────────
  const tabs = document.querySelectorAll(".inspiration-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      document.querySelectorAll(".inspiration-grid").forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    });
  });
})();
