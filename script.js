// Portfolio Joel Yapi — thème, filtre des projets, apparition au défilement.

const root = document.documentElement;

// Thème clair / sombre : on part du choix enregistré, sinon du réglage du système.
document.querySelector(".theme").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Filtre par catégorie : une carte peut appartenir à plusieurs catégories (data-cat="web design").
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".card");
const count = document.querySelector(".count");

function applyFilter(filter) {
  let shown = 0;
  cards.forEach((card) => {
    const match = filter === "tout" || card.dataset.cat.split(" ").includes(filter);
    card.hidden = !match;
    if (match) shown++;
  });
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  count.textContent = `${shown} projet${shown > 1 ? "s" : ""} affiché${shown > 1 ? "s" : ""}`;
}

chips.forEach((chip) => chip.addEventListener("click", () => applyFilter(chip.dataset.filter)));
applyFilter("tout");

// Apparition douce des cartes, sauf si l'utilisateur limite les animations.
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("reveal");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  cards.forEach((card) => { card.classList.add("reveal"); io.observe(card); });
}
