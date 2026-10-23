(() => {
  // Preview the chosen photo in the upload box
  document.querySelectorAll("[data-upload]").forEach((box) => {
    const input = box.querySelector('input[type="file"]');
    const preview = box.querySelector(".upload-preview");
    const empty = box.querySelector(".upload-empty");

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
      empty.hidden = true;
    });
  });
})();
