// Portfolio Joel Yapi — menu, contact, filtres, fiches projet, apparition au défilement.

// ---------- Coordonnées (laisser vide pour masquer un moyen de contact) ----------
const CONTACT = {
  whatsapp: "2250787898104",          // indicatif + numéro, sans espace ni « + »
  email: "yapi.joel.dev@gmail.com",
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---------- Liens de contact ----------
$$('[data-contact="whatsapp"]').forEach((el) => {
  if (!CONTACT.whatsapp) return el.classList.add("is-off");
  const a = el.tagName === "A" ? el : $("a", el);
  a.href = `https://wa.me/${CONTACT.whatsapp}`;
});
$$('[data-contact="email"]').forEach((el) => {
  if (!CONTACT.email) return el.classList.add("is-off");
  const a = el.tagName === "A" ? el : $("a", el);
  a.href = `mailto:${CONTACT.email}`;
});

// Le formulaire prépare un message WhatsApp (ou un e-mail) : aucun serveur nécessaire.
const form = $('[data-contact="form"]');
if (!CONTACT.whatsapp && !CONTACT.email) form.classList.add("is-off");
if (!CONTACT.whatsapp && CONTACT.email) $("button", form).firstChild.textContent = "Envoyer par e-mail ";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const text = `Bonjour Joel, je suis ${d.get("nom")}.\nProjet : ${d.get("type")}\n\n${d.get("message")}`;
  const url = CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${CONTACT.email}?subject=${encodeURIComponent("Projet : " + d.get("type"))}&body=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
});

// ---------- Photos : un monogramme remplace une photo absente ----------
$$("[data-photo]").forEach((fig) => {
  const img = $("img", fig);
  const fail = () => fig.classList.add("no-photo");
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener("error", fail);
});

// ---------- En-tête : ombre au défilement, menu mobile, lien actif ----------
const header = $(".top");
const burger = $(".burger");
const menu = $("#menu");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 8), { passive: true });
burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") !== "true";
  burger.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);
});
$$("a", menu).forEach((a) => a.addEventListener("click", () => {
  burger.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
}));

if ("IntersectionObserver" in window) {
  const links = $$("a", menu);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });
}

// ---------- Filtre des projets (une carte peut avoir plusieurs catégories) ----------
const chips = $$(".chip");
const cards = $$(".card");
chips.forEach((chip) => chip.addEventListener("click", () => {
  const f = chip.dataset.filter;
  cards.forEach((c) => { c.hidden = f !== "tout" && !c.dataset.cat.split(" ").includes(f); });
  chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
}));

// ---------- Fiche détaillée d'un projet ----------
const modal = $(".modal");
function openProject(card) {
  $(".modal-media", modal).replaceChildren($(".thumb", card).cloneNode(true));
  $("#modal-title").textContent = $(".card-body h3", card).textContent;
  const content = $(".detail", card).cloneNode(true);
  content.hidden = false;
  $(".modal-content", modal).replaceChildren(...content.childNodes);
  modal.showModal();
  modal.scrollTop = 0;
  history.replaceState(null, "", "#" + card.id);
}
cards.forEach((card) => card.addEventListener("click", (e) => {
  if (e.target.closest("a")) return;
  openProject(card);
}));
$(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
modal.addEventListener("close", () => history.replaceState(null, "", "#projets"));

// Lien direct vers un projet (ex. …/#p-max) : on ouvre sa fiche.
function openFromHash() {
  const card = /^#p-[\w-]+$/.test(location.hash) && $(`.card${location.hash}`);
  if (card && !modal.open) { $("#projets").scrollIntoView(); openProject(card); }
}
openFromHash();
addEventListener("hashchange", openFromHash);

// ---------- Apparition douce au défilement ----------
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.addEventListener("transitionend", () => { en.target.style.transitionDelay = ""; }, { once: true });
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  $$(".service, .skill, .card, .timeline li, .steps li, .stats div, .quote").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });
}
