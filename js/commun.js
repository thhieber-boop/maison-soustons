/*
  CODE COMMUN À TOUTES LES PAGES
  - choix de la langue
  - en-tête (menu) et pied de page, construits ici pour ne les écrire qu'une fois
  - visionneuse photo plein écran
  - petits outils (prix, dates, photos)
  Chaque page a ensuite son propre fichier (js/page-maison.js, js/page-reserver.js…).
*/

const $ = (id) => document.getElementById(id);
const PAGE = document.body.dataset.page; // "accueil", "maison"… (écrit dans chaque fichier .html)

/* ============================================================
   1. Langue
   ============================================================ */
// Priorité : ?lang=xx dans l'adresse > choix mémorisé > langue du navigateur > 1re langue
function langueDeDepart() {
  const dispo = (l) => l && CONFIG.langues.includes(l);
  const dansAdresse = new URLSearchParams(location.search).get("lang");
  if (dispo(dansAdresse)) return dansAdresse;
  try {
    const memorisee = localStorage.getItem("langue");
    if (dispo(memorisee)) return memorisee;
  } catch (e) { /* mémoire du navigateur indisponible : on ignore */ }
  for (const l of navigator.languages || []) {
    const code = l.slice(0, 2).toLowerCase(); // "en-GB" -> "en"
    if (dispo(code)) return code;
  }
  return CONFIG.langues[0];
}

let langue = langueDeDepart();
let T = TEXTES[langue]; // T = les textes de la langue choisie

// Chaque page fournit sa fonction d'affichage ; on la rappelle quand la langue change
let afficherPage = () => {};

function changerLangue(nouvelle) {
  langue = nouvelle;
  T = TEXTES[langue];
  try { localStorage.setItem("langue", langue); } catch (e) {}
  const adresse = new URL(location.href);
  adresse.searchParams.set("lang", langue);
  history.replaceState(null, "", adresse);
  afficherTout();
}

/* ============================================================
   2. Petits outils
   ============================================================ */
// Texte par son chemin : lire("menu.photos") -> T.menu.photos
const lire = (chemin) => chemin.split(".").reduce((o, cle) => o?.[cle], T) ?? "";

// Remplace {prix}, {n}… par leur valeur
const remplir = (texte, valeurs) => texte.replace(/\{(\w+)\}/g, (_, cle) => valeurs[cle] ?? "");

// Prix au format de la langue : 2800 -> "2 800 €" (fr), "€2,800" (en)
const euros = (n) =>
  new Intl.NumberFormat(langue, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

// Lien vers une autre page en gardant la langue
const lien = (page) => `${page === "accueil" ? "index" : page}.html?lang=${langue}`;

// Photos : "piece/nom" -> chemin du fichier
const photo = (chemin, taille = "petit") => `photos/${chemin}-${taille}.webp`;
const photosDe = (piece) => (PHOTOS[piece] || []).map((nom) => `${piece}/${nom}`);
const legende = (chemin) => T.legendes[chemin] || T.pieces[chemin.split("/")[0]]?.nom || "";

// Évite qu'un texte saisi par un visiteur soit pris pour du code HTML
const echapper = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/* ---------- Dates ----------
   Une date est manipulée comme un NUMÉRO DE JOUR (jours depuis le 1er janvier 1970).
   C'est plus simple et sans piège de changement d'heure : demain = jour + 1. */
const UN_JOUR = 86400000;
const versJour = (texte) => Date.UTC(...texte.split("-").map((n, i) => (i === 1 ? n - 1 : +n))) / UN_JOUR;
const versTexte = (jour) => new Date(jour * UN_JOUR).toISOString().slice(0, 10); // -> "2027-07-03"
const aujourdhui = () => Math.floor(Date.now() / UN_JOUR);
const jourSemaine = (jour) => new Date(jour * UN_JOUR).getUTCDay(); // 0 = dimanche, 5 = vendredi, 6 = samedi
const formatDate = (jour, options) =>
  new Intl.DateTimeFormat(langue, { timeZone: "UTC", ...options }).format(new Date(jour * UN_JOUR));

/* ============================================================
   3. En-tête, menu et pied de page
   ============================================================ */
const PAGES = ["accueil", "maison", "photos", "autour", "tarifs", "reserver", "contact"];

function afficherEntete() {
  $("entete").innerHTML = `
    <a href="${lien("accueil")}" class="logo">${CONFIG.nom}</a>
    <nav class="menu" id="menu">
      ${PAGES.map((p) => `
        <a href="${lien(p)}" class="${p === PAGE ? "actif" : ""} ${p === "reserver" ? "bouton-petit" : ""}">${T.menu[p]}</a>`).join("")}
    </nav>
    <div class="entete-droite">
      <select id="choix-langue" class="choix-langue" aria-label="Langue / Language">
        ${CONFIG.langues.map((l) => `<option value="${l}" ${l === langue ? "selected" : ""}>${l.toUpperCase()}</option>`).join("")}
      </select>
      <button class="menu-bouton" id="menu-bouton" aria-label="${T.menu.ouvrir}" aria-expanded="false">☰</button>
    </div>`;
  $("choix-langue").onchange = (e) => changerLangue(e.target.value);
  $("menu-bouton").onclick = () => {
    const ouvert = document.body.classList.toggle("menu-ouvert");
    $("menu-bouton").setAttribute("aria-expanded", ouvert);
  };

  $("pied").innerHTML = `
    <p>${CONFIG.nom} · ${T.pied}</p>
    <p><a href="tel:${CONFIG.telephone.replace(/\s/g, "")}">${CONFIG.telephone}</a></p>`;
}

/* ============================================================
   4. Visionneuse photo plein écran
   ============================================================ */
// La visionneuse est ajoutée à la page par le code (elle est identique partout)
document.body.insertAdjacentHTML("beforeend", `
  <div class="visionneuse" id="visionneuse" hidden>
    <button class="visionneuse-fermer" id="vis-fermer">✕</button>
    <button class="visionneuse-prec" id="vis-prec">‹</button>
    <figure>
      <img id="vis-image" alt="">
      <figcaption><span id="vis-legende"></span> <span class="vis-compteur" id="vis-compteur"></span></figcaption>
    </figure>
    <button class="visionneuse-suiv" id="vis-suiv">›</button>
  </div>`);

let visListe = [];   // les photos de la série ouverte ("piece/nom")
let visIndex = 0;

function ouvrirVisionneuse(liste, index = 0) {
  visListe = liste;
  montrerPhoto(index);
  $("visionneuse").hidden = false;
  document.body.style.overflow = "hidden";
}
function montrerPhoto(i) {
  visIndex = (i + visListe.length) % visListe.length; // boucle début/fin
  const chemin = visListe[visIndex];
  $("vis-image").src = photo(chemin, "grand");
  $("vis-image").alt = legende(chemin);
  $("vis-legende").textContent = legende(chemin);
  $("vis-compteur").textContent = `${visIndex + 1} / ${visListe.length}`;
}
function fermerVisionneuse() {
  $("visionneuse").hidden = true;
  document.body.style.overflow = "";
}

$("vis-fermer").onclick = fermerVisionneuse;
$("vis-prec").onclick = () => montrerPhoto(visIndex - 1);
$("vis-suiv").onclick = () => montrerPhoto(visIndex + 1);
$("visionneuse").onclick = (e) => { if (e.target.id === "visionneuse") fermerVisionneuse(); };
document.addEventListener("keydown", (e) => {
  if ($("visionneuse").hidden) return;
  if (e.key === "Escape") fermerVisionneuse();
  if (e.key === "ArrowLeft") montrerPhoto(visIndex - 1);
  if (e.key === "ArrowRight") montrerPhoto(visIndex + 1);
});
let departX = null; // mobile : glisser le doigt
$("visionneuse").addEventListener("touchstart", (e) => (departX = e.touches[0].clientX));
$("visionneuse").addEventListener("touchend", (e) => {
  const ecart = e.changedTouches[0].clientX - departX;
  if (Math.abs(ecart) > 50) montrerPhoto(visIndex + (ecart < 0 ? 1 : -1));
});

// Toute image avec data-serie="a,b,c" et data-index="n" ouvre la visionneuse sur cette série
document.addEventListener("click", (e) => {
  const declencheur = e.target.closest("[data-serie]");
  if (!declencheur) return;
  ouvrirVisionneuse(declencheur.dataset.serie.split(","), Number(declencheur.dataset.index || 0));
});

/* ============================================================
   5. Affichage général
   ============================================================ */
function afficherTout() {
  document.documentElement.lang = langue;
  const titre = lire(`${PAGE}.titrePage`);
  document.title = PAGE === "accueil" ? `${CONFIG.nom} · ${titre}` : `${titre} · ${CONFIG.nom}`;
  document.querySelector('meta[name="description"]').content = T.descriptionSite;

  afficherEntete();
  // Textes simples : <h1 data-t="maison.titre"></h1>
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = lire(el.dataset.t)));
  document.querySelectorAll("[data-t-aria]").forEach((el) => el.setAttribute("aria-label", lire(el.dataset.tAria)));
  $("vis-fermer").ariaLabel = T.galerie.fermer;
  $("vis-prec").ariaLabel = T.galerie.precedente;
  $("vis-suiv").ariaLabel = T.galerie.suivante;

  afficherPage(); // la partie propre à chaque page
}

// Image de fond de la page (voir fondsPages dans config.js)
document.body.insertAdjacentHTML("afterbegin",
  `<div class="fond-page" style="background-image:url('${photo(CONFIG.fondsPages[PAGE], "grand")}')"></div>`);

// Démarrage, une fois que la page a chargé son propre fichier js
window.addEventListener("DOMContentLoaded", afficherTout);
