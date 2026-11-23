/*
  PAGE RÉSERVER : calendrier des disponibilités, récapitulatif et formulaire de demande.
  Le calendrier affiche une ligne par semaine (du samedi au vendredi soir, départ le samedi),
  avec son prix et son statut. Hors juillet-août, un bouton « week-end » est proposé sous chaque ligne.
*/

const PERIODES = periodesReservables(); // toutes les semaines et week-ends possibles
let selection = [];                      // les périodes choisies par le visiteur (qui se suivent)
let moisAffiche;                         // { annee, mois } (mois de 0 à 11)
let pret = false;                        // vrai une fois les occupations chargées

const cle = (p) => `${p.type}-${p.du}`;
const trouver = (c) => PERIODES.find((p) => cle(p) === c);
const choisie = (p) => selection.includes(p);

/* ============================================================
   Calendrier
   ============================================================ */
const moisDe = (jour) => {
  const d = new Date(jour * UN_JOUR);
  return { annee: d.getUTCFullYear(), mois: d.getUTCMonth() };
};
const memeMois = (a, b) => a.annee === b.annee && a.mois === b.mois;

// Tous les mois couverts par les semaines réservables
const MOIS = PERIODES.filter((p) => p.type === "semaine")
  .map((p) => moisDe(p.du))
  .filter((m, i, liste) => i === 0 || !memeMois(m, liste[i - 1]));

function afficherCalendrier() {
  const indexMois = MOIS.findIndex((m) => memeMois(m, moisAffiche));
  const premierDuMois = Date.UTC(moisAffiche.annee, moisAffiche.mois, 1) / UN_JOUR;
  $("mois-titre").textContent = formatDate(premierDuMois, { month: "long", year: "numeric" });
  $("mois-prec").disabled = indexMois <= 0;
  $("mois-suiv").disabled = indexMois >= MOIS.length - 1;

  // Raccourcis vers chaque mois
  $("mois-choix").innerHTML = MOIS.map((m, i) => {
    const jour = Date.UTC(m.annee, m.mois, 1) / UN_JOUR;
    return `<button class="${i === indexMois ? "actif" : ""}" data-mois="${i}">${formatDate(jour, { month: "short" })}</button>`;
  }).join("");

  // Nuits choisies, pour les colorer case par case
  const nuitsChoisies = new Set();
  selection.forEach((p) => { for (let j = p.du; j < p.au; j++) nuitsChoisies.add(j); });

  // En-tête des jours : samedi → vendredi
  const premierSamedi = PERIODES.find((p) => p.type === "semaine").du;
  const entete = [0, 1, 2, 3, 4, 5, 6]
    .map((i) => `<span>${formatDate(premierSamedi + i, { weekday: "short" })}</span>`)
    .join("");

  const semaines = PERIODES.filter((p) => p.type === "semaine" && memeMois(moisDe(p.du), moisAffiche));
  const lignes = semaines.map((s) => {
    const etat = choisie(s) ? "selection" : statutDe(s);
    const cliquable = etat === "disponible" || etat === "selection";
    const jours = [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const j = s.du + i;
      const classes = [
        memeMois(moisDe(j), moisAffiche) ? "" : "autre-mois",
        nuitsChoisies.has(j) ? "nuit-choisie" : "",
      ].join(" ");
      return `<span class="${classes}">${formatDate(j, { day: "numeric" })}</span>`;
    }).join("");

    // Week-end qui commence le vendredi de cette ligne (hors juillet-août)
    const we = PERIODES.find((p) => p.type === "weekEnd" && p.du === s.du + 6);
    let boutonWE = "";
    if (we) {
      const etatWE = choisie(we) ? "selection" : statutDe(we);
      boutonWE = `
        <button class="we etat-${etatWE}" data-cle="${cle(we)}" ${etatWE === "disponible" || etatWE === "selection" ? "" : "disabled"}>
          <span>${T.reserver.weekEnd} ${formatDate(we.du, { weekday: "short", day: "numeric" })} → ${formatDate(we.au, { weekday: "short", day: "numeric", month: "short" })}</span>
          <strong>${euros(we.prix)}</strong>
          ${etatWE !== "disponible" && etatWE !== "passe" ? `<em>${T.reserver.etats[etatWE]}</em>` : ""}
        </button>`;
    }

    return `
      <div class="semaine etat-${etat}">
        <button class="semaine-bande" data-cle="${cle(s)}" ${cliquable ? "" : "disabled"}>
          <span class="semaine-haut">
            <span class="semaine-dates">${formatDate(s.du, { day: "numeric", month: "short" })} → ${formatDate(s.au, { day: "numeric", month: "short" })}</span>
            <strong class="semaine-prix">${euros(s.prix)}</strong>
          </span>
          <span class="semaine-etat">${etat === "passe" ? "" : T.reserver.etats[etat]}</span>
          <span class="jours">${jours}</span>
        </button>
        ${boutonWE}
      </div>`;
  });

  $("calendrier").innerHTML = `<div class="jours-entete">${entete}</div>${lignes.join("")}`;
}

/* ---------- Clics dans le calendrier ---------- */
function cliquer(p) {
  if (p.type === "weekEnd" || selection[0]?.type === "weekEnd") {
    selection = choisie(p) ? [] : [p];                  // un week-end se choisit seul
  } else if (choisie(p)) {
    // re-cliquer une semaine au bord de la sélection la retire, sinon on repart d'elle seule
    if (p === selection[0] && selection.length > 1) selection.shift();
    else if (p === selection.at(-1) && selection.length > 1) selection.pop();
    else selection = [];
  } else if (selection.length && p.du === selection.at(-1).au) {
    selection.push(p);                                  // semaine suivante : on prolonge
  } else if (selection.length && p.au === selection[0].du) {
    selection.unshift(p);                               // semaine précédente : on prolonge
  } else {
    selection = [p];
  }
  $("merci").hidden = true;
  afficherCalendrier();
  afficherRecap();
}

$("calendrier").addEventListener("click", (e) => {
  const bouton = e.target.closest("[data-cle]");
  if (bouton && !bouton.disabled) cliquer(trouver(bouton.dataset.cle));
});
$("mois-choix").addEventListener("click", (e) => {
  const bouton = e.target.closest("[data-mois]");
  if (bouton) { moisAffiche = MOIS[bouton.dataset.mois]; afficherCalendrier(); }
});
$("mois-prec").onclick = () => changerMois(-1);
$("mois-suiv").onclick = () => changerMois(+1);
function changerMois(sens) {
  const i = MOIS.findIndex((m) => memeMois(m, moisAffiche)) + sens;
  if (MOIS[i]) { moisAffiche = MOIS[i]; afficherCalendrier(); }
}

/* ============================================================
   Récapitulatif et prix
   ============================================================ */
function optionsChoisies() {
  const options = {};
  document.querySelectorAll("#options-services input").forEach((i) => (options[i.name] = Number(i.value)));
  return options;
}

function afficherOptions() {
  const valeurs = optionsChoisies(); // garde les valeurs déjà saisies
  $("options-services").innerHTML = CONFIG.services
    .filter((s) => !s.obligatoire)
    .map((s) => `
      <label><span>${T.services[s.cle].nom} · ${euros(s.prix)} ${T.unites[s.unite]}</span>
        <input type="number" name="${s.cle}" min="0" max="${s.max || 10}" value="${valeurs[s.cle] || 0}">
      </label>`)
    .join("");
}
$("options-services").addEventListener("input", () => afficherRecap());

function afficherRecap() {
  if (!selection.length) {
    $("recap-contenu").innerHTML = `<p class="recap-vide">${T.reserver.aucuneSelection}</p>`;
    $("formulaire").hidden = true;
    return;
  }
  const du = selection[0].du;
  const au = selection.at(-1).au;
  const prix = calculerPrix(selection, optionsChoisies());
  const longue = { weekday: "long", day: "numeric", month: "long" };
  const court = { day: "numeric", month: "short" };

  const lignesLocation = selection
    .map((p) => `<li><span>${p.type === "weekEnd" ? T.reserver.weekEnd : T.reserver.semaine}
      ${formatDate(p.du, court)} → ${formatDate(p.au, court)}</span><span>${euros(p.prix)}</span></li>`)
    .join("");
  const lignesServices = prix.services
    .map((l) => `<li><span>${T.services[l.cle].nom}${l.quantite > 1 ? ` × ${l.quantite}` : ""}</span><span>${euros(l.montant)}</span></li>`)
    .join("");

  $("recap-contenu").innerHTML = `
    <dl class="recap-dates">
      <div><dt>${T.reserver.arrivee}</dt><dd>${formatDate(du, longue)}</dd></div>
      <div><dt>${T.reserver.depart}</dt><dd>${formatDate(au, longue)}</dd></div>
    </dl>
    <p class="recap-nuits">${remplir(T.reserver.nuits, { n: au - du })}</p>
    <ul class="recap-lignes">${lignesLocation}${lignesServices}
      <li class="recap-total"><span>${T.reserver.total}</span><span>${euros(prix.total)}</span></li>
    </ul>
    <p class="note">${remplir(T.reserver.caution, { caution: euros(CONFIG.caution) })}</p>`;
  $("formulaire").hidden = false;
}

/* ============================================================
   Envoi de la demande
   ============================================================ */
function montrerErreur(texte) {
  $("erreur").textContent = texte;
  $("erreur").hidden = false;
}

$("formulaire").addEventListener("submit", async (e) => {
  e.preventDefault();
  const champs = Object.fromEntries(new FormData(e.target));
  if (champs.site_web) return; // rempli = robot : on ignore
  $("erreur").hidden = true;

  const personnes = Number(champs.adultes) + Number(champs.enfants);
  if (personnes > CONFIG.personnesMax) {
    return montrerErreur(remplir(T.reserver.tropDePersonnes, { n: CONFIG.personnesMax }));
  }

  $("envoyer").disabled = true;
  $("envoyer").textContent = T.reserver.envoiEnCours;
  try {
    // Quelqu'un a-t-il pris la période entre-temps ?
    await chargerOccupations();
    if (selection.some((p) => statutDe(p) !== "disponible")) {
      selection = [];
      afficherCalendrier();
      afficherRecap();
      return montrerErreur(T.reserver.plusDisponible);
    }
    const options = optionsChoisies();
    const resultat = await envoyerDemande({
      du: versTexte(selection[0].du),
      au: versTexte(selection.at(-1).au),
      formule: selection[0].type,
      nom: champs.nom,
      email: champs.email,
      telephone: champs.telephone,
      adultes: Number(champs.adultes),
      enfants: Number(champs.enfants),
      services: options,
      total: calculerPrix(selection, options).total,
      message: champs.message,
      langue,
    });
    if (!resultat.ok) {
      throw new Error(resultat.erreur === "indisponible" ? T.reserver.plusDisponible : T.reserver.erreur);
    }
    // Succès : la période passe en « demande en cours »
    await chargerOccupations();
    selection = [];
    e.target.reset();
    afficherCalendrier();
    afficherRecap();
    $("merci-texte").textContent = remplir(T.reserver.merciTexte, { jours: CONFIG.expirationDemandeJours });
    $("merci").hidden = false;
  } catch (err) {
    montrerErreur(err.message && !err.message.startsWith("Failed") ? err.message : remplir(T.reserver.erreur, { telephone: CONFIG.telephone }));
  } finally {
    $("envoyer").disabled = false;
    $("envoyer").textContent = T.reserver.envoyer;
  }
});
$("nouvelle-demande").onclick = () => { $("merci").hidden = true; };

/* ============================================================
   Affichage (rappelé à chaque changement de langue)
   ============================================================ */
afficherPage = () => {
  $("bandeau-essai").hidden = !MODE_ESSAI;
  $("legende").innerHTML = ["disponible", "demande", "reserve", "selection"]
    .map((e) => `<li><span class="pastille etat-${e}"></span>${T.reserver.etats[e]}</li>`)
    .join("");
  afficherOptions();
  afficherRecap();
  if (pret) afficherCalendrier();
};

// Démarrage : 1er mois qui contient une semaine encore à venir, puis chargement des occupations
moisAffiche = moisDe((PERIODES.find((p) => p.type === "semaine" && p.du > aujourdhui()) || PERIODES[0]).du);
chargerOccupations()
  .catch(() => {}) // si le chargement échoue, on affiche tout comme disponible
  .finally(() => { pret = true; afficherCalendrier(); });
