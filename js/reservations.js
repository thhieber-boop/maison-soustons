/*
  LOGIQUE DES RÉSERVATIONS (sans affichage)
  - construit la liste des périodes réservables (semaines et week-ends) à partir de config.js
  - calcule le prix et le statut de chacune
  - lit et enregistre les demandes : Google Sheet si CONFIG.urlScriptGoogle est rempli,
    sinon « mode essai » dans le navigateur
*/

const MODE_ESSAI = !CONFIG.urlScriptGoogle;
const CLE_ESSAI = "demandes-essai";

/* ---------- Saison d'une nuit donnée ---------- */
function saisonDu(jour) {
  const p = CONFIG.periodes.find((p) => jour >= versJour(p.du) && jour < versJour(p.au));
  return p ? p.saison : null; // null = hors des dates ouvertes
}

/* ---------- Toutes les périodes réservables ----------
   Chaque période : { type: "semaine" | "weekEnd", du, au (numéros de jour, départ exclu), prix, saison } */
function periodesReservables() {
  const debut = versJour(CONFIG.periodes[0].du);
  const fin = versJour(CONFIG.periodes[CONFIG.periodes.length - 1].au);
  const liste = [];
  for (let jour = debut; jour < fin; jour++) {
    const saison = saisonDu(jour);
    if (!saison) continue;
    const tarif = CONFIG.saisons[saison];
    // Semaine : arrivée le samedi, départ le samedi suivant
    if (jourSemaine(jour) === 6 && jour + 7 <= fin) {
      liste.push({ type: "semaine", du: jour, au: jour + 7, prix: tarif.prixSemaine, saison });
    }
    // Week-end : arrivée le vendredi, 3 nuits, si la saison le permet pour les 3 nuits
    if (jourSemaine(jour) === 5 && jour + 3 <= fin) {
      const prixWE = [0, 1, 2].map((i) => CONFIG.saisons[saisonDu(jour + i)]?.prixWeekEnd);
      if (prixWE.every((p) => p)) {
        liste.push({ type: "weekEnd", du: jour, au: jour + 3, prix: tarif.prixWeekEnd, saison });
      }
    }
  }
  return liste;
}

/* ---------- Occupations (réservé / demande en cours) ---------- */
let OCCUPATIONS = []; // [{ du, au, statut }] en numéros de jour

// Une demande trop ancienne et non confirmée ne bloque plus la période
function encoreValable(o) {
  if (o.statut !== "demande" || !o.demandeLe) return true;
  return Date.now() - new Date(o.demandeLe).getTime() < CONFIG.expirationDemandeJours * UN_JOUR;
}

async function chargerOccupations() {
  let liste = [...CONFIG.occupations];
  if (MODE_ESSAI) {
    try { liste = liste.concat(JSON.parse(localStorage.getItem(CLE_ESSAI) || "[]")); } catch (e) {}
  } else {
    const reponse = await fetch(CONFIG.urlScriptGoogle + "?action=occupations");
    liste = liste.concat(await reponse.json());
  }
  OCCUPATIONS = liste
    .filter((o) => o.statut === "reserve" || o.statut === "demande")
    .filter(encoreValable)
    .map((o) => ({ du: versJour(o.du), au: versJour(o.au), statut: o.statut }));
}

// Statut d'une période : "reserve", "demande" ou "disponible" (et "passe" si déjà commencée)
function statutDe(periode) {
  if (periode.du <= aujourdhui()) return "passe";
  const chevauche = OCCUPATIONS.filter((o) => o.du < periode.au && periode.du < o.au);
  if (chevauche.some((o) => o.statut === "reserve")) return "reserve";
  if (chevauche.length) return "demande";
  return "disponible";
}

/* ---------- Prix d'un séjour ---------- */
// selection = liste de périodes qui se suivent ; options = { veloEnfant: 2, … }
function calculerPrix(selection, options) {
  const location = selection.reduce((somme, p) => somme + p.prix, 0);
  const nbSemaines = Math.max(1, Math.round((selection.at(-1).au - selection[0].du) / 7));
  const lignes = CONFIG.services
    .map((s) => {
      const quantite = s.obligatoire ? 1 : Number(options[s.cle] || 0);
      const fois = s.unite === "semaine" ? nbSemaines : 1;
      return { cle: s.cle, quantite, montant: s.prix * quantite * fois };
    })
    .filter((l) => l.quantite > 0);
  const total = location + lignes.reduce((somme, l) => somme + l.montant, 0);
  return { location, services: lignes, total };
}

/* ---------- Envoi d'une demande ---------- */
async function envoyerDemande(demande) {
  if (MODE_ESSAI) {
    await new Promise((ok) => setTimeout(ok, 600)); // simule l'envoi
    const liste = JSON.parse(localStorage.getItem(CLE_ESSAI) || "[]");
    liste.push({ du: demande.du, au: demande.au, statut: "demande", demandeLe: new Date().toISOString() });
    localStorage.setItem(CLE_ESSAI, JSON.stringify(liste));
    return { ok: true };
  }
  // text/plain évite une vérification préalable du navigateur que Google ne gère pas
  const reponse = await fetch(CONFIG.urlScriptGoogle, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "reservation", ...demande }),
  });
  return reponse.json(); // { ok: true } ou { ok: false, erreur: "indisponible" }
}

async function envoyerMessage(message) {
  if (MODE_ESSAI) {
    await new Promise((ok) => setTimeout(ok, 600));
    return { ok: true };
  }
  const reponse = await fetch(CONFIG.urlScriptGoogle, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "contact", ...message }),
  });
  return reponse.json();
}
