(() => {
  // ── Confirm destructive forms ────────────────────
  document.querySelectorAll("form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (!confirm(form.dataset.confirm)) e.preventDefault();
    });
  });

  // ── Share ────────────────────────────────────────
  const share = document.querySelector("[data-share]");
  if (share) {
    share.addEventListener("click", async () => {
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) return await navigator.share(data);
        await navigator.clipboard.writeText(location.href);
        share.innerHTML = '<i class="fa-solid fa-check"></i> Link copied';
      } catch (e) {}
    });
  }

  // ── Booking price breakdown ──────────────────────
  const card = document.querySelector(".booking-card");
  if (!card) return;

  const price = Number(card.dataset.price) || 0;
  const checkin = card.querySelector('[name="checkin"]');
  const checkout = card.querySelector('[name="checkout"]');
  const breakdown = card.querySelector("[data-breakdown]");
  const note = card.querySelector("[data-booking-note]");
  const inr = (n) => "₹" + n.toLocaleString("en-IN");

  const today = new Date().toISOString().slice(0, 10);
  checkin.min = today;
  checkout.min = today;

  const update = () => {
    if (checkin.value) checkout.min = checkin.value;
    const nights = Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
    if (!checkin.value || !checkout.value || !(nights > 0)) {
      breakdown.hidden = true;
      return;
    }
    breakdown.hidden = false;
    card.querySelector("[data-breakdown-label]").textContent =
      `${inr(price)} x ${nights} night${nights !== 1 ? "s" : ""}`;
    card.querySelector("[data-breakdown-total]").textContent = inr(price * nights);
    card.querySelector("[data-breakdown-grand]").textContent = inr(price * nights);
  };

  checkin.addEventListener("change", update);
  checkout.addEventListener("change", update);

  card.querySelector("[data-reserve]").addEventListener("click", () => {
    note.textContent = "Online reservations are coming soon to WanderLust.";
  });
})();
