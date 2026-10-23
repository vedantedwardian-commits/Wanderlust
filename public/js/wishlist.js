(() => {
  // Wishlist hearts on listing cards, remembered per browser
  const KEY = "wanderlust-wishlist";
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (e) {}

  const persist = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch (e) {}
  };

  document.querySelectorAll("[data-wishlist-id], .stay-heart").forEach((heart) => {
    const id = heart.dataset.id || heart.dataset.wishlistId;
    heart.classList.toggle("is-saved", saved.includes(id));
    heart.addEventListener("click", () => {
      saved = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
      heart.classList.toggle("is-saved", saved.includes(id));
      persist();
    });
  });
})();
