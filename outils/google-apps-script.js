/*
  ============================================================
  SCRIPT GOOGLE : lien entre le site et ton Google Sheet
  ============================================================
  Ce code ne s'exécute PAS sur le site : il se colle dans Google Apps Script
  (voir outils/GUIDE-GOOGLE-SHEETS.md, étape par étape).

  Il fait 3 choses :
  1. donne au site la liste des périodes prises (sans aucune donnée personnelle)
  2. enregistre chaque demande de réservation dans le tableau, statut « demande »
  3. envoie les e-mails : une notification à toi, une confirmation au visiteur

  Dans le tableau, tu gères la colonne « Statut » :
    demande  → la période apparaît « demande en cours » sur le site
    réservé  → la période apparaît « réservée »
    annulé   → la période redevient disponible (ou supprime simplement la ligne)
  Une « demande » de plus de EXPIRATION_JOURS jours redevient disponible toute seule.
*/

const NOM_MAISON = "Villa des Vergnes";
const EMAIL_PROPRIETAIRE = "th.hieber@gmail.com";
const EXPIRATION_JOURS = 3;
const FEUILLE = "Réservations";
const COLONNES = ["Statut", "Arrivée", "Départ", "Formule", "Nom", "E-mail", "Téléphone",
  "Adultes", "Enfants", "Services", "Total estimé", "Message", "Langue", "Demandé le"];

/* ---------- Le site demande la liste des périodes prises ---------- */
function doGet(e) {
  const occupations = lireLignes()
    .filter((l) => l.statut === "reserve" || l.statut === "demande")
    .filter((l) => l.statut === "reserve" || !expiree(l))
    .map((l) => ({ du: l.du, au: l.au, statut: l.statut, demandeLe: l.demandeLe }));
  return json(occupations);
}

/* ---------- Le site envoie une demande ou un message ---------- */
function doPost(e) {
  const d = JSON.parse(e.postData.contents);

  if (d.type === "contact") {
    MailApp.sendEmail({
      to: EMAIL_PROPRIETAIRE,
      replyTo: d.email,
      subject: `[${NOM_MAISON}] Message de ${d.nom}`,
      body: `${d.nom} (${d.email}) a écrit :\n\n${d.message}`,
    });
    return json({ ok: true });
  }

  // --- Demande de réservation ---
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.du) || !/^\d{4}-\d{2}-\d{2}$/.test(d.au) || !d.email || !d.nom) {
    return json({ ok: false, erreur: "donnees" });
  }
  // Un verrou empêche deux demandes simultanées sur la même période
  const verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    const prise = lireLignes().some((l) =>
      (l.statut === "reserve" || (l.statut === "demande" && !expiree(l))) && l.du < d.au && d.du < l.au);
    if (prise) return json({ ok: false, erreur: "indisponible" });

    const services = Object.entries(d.services || {}).filter(([, n]) => n > 0).map(([s, n]) => `${s} × ${n}`).join(", ");
    feuille().appendRow(["demande", d.du, d.au, d.formule, d.nom, d.email, d.telephone || "",
      d.adultes, d.enfants, services, d.total, d.message || "", d.langue, new Date()]);
  } finally {
    verrou.releaseLock();
  }

  // E-mail pour toi
  MailApp.sendEmail({
    to: EMAIL_PROPRIETAIRE,
    replyTo: d.email,
    subject: `[${NOM_MAISON}] Nouvelle demande : ${d.du} → ${d.au}`,
    body: `Nouvelle demande de réservation\n\n` +
      `Dates : ${d.du} → ${d.au} (${d.formule})\nNom : ${d.nom}\nE-mail : ${d.email}\nTéléphone : ${d.telephone || "-"}\n` +
      `Personnes : ${d.adultes} adulte(s), ${d.enfants} enfant(s)\nTotal estimé : ${d.total} €\nMessage : ${d.message || "-"}\n\n` +
      `Sans réponse de ta part, la période redevient disponible dans ${EXPIRATION_JOURS} jours.\n` +
      `Pour confirmer : mets « réservé » dans la colonne Statut du tableau.\n${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
  });

  // E-mail de confirmation pour le visiteur, dans sa langue
  const m = MESSAGES[d.langue] || MESSAGES.en;
  MailApp.sendEmail({
    to: d.email,
    replyTo: EMAIL_PROPRIETAIRE,
    name: NOM_MAISON,
    subject: `${NOM_MAISON} – ${m.sujet}`,
    body: m.texte(d),
  });

  return json({ ok: true });
}

/* ---------- Messages au visiteur ---------- */
const MESSAGES = {
  fr: { sujet: "votre demande de réservation", texte: (d) =>
    `Bonjour ${d.nom},\n\nNous avons bien reçu votre demande pour la période du ${d.du} au ${d.au} (total estimé : ${d.total} €).\n` +
    `Nous vous répondons sous ${EXPIRATION_JOURS} jours pour la confirmer.\n\nÀ bientôt à Soustons !\n${NOM_MAISON}` },
  en: { sujet: "your booking request", texte: (d) =>
    `Hello ${d.nom},\n\nWe have received your request for ${d.du} to ${d.au} (estimated total: €${d.total}).\n` +
    `We will reply within ${EXPIRATION_JOURS} days to confirm.\n\nSee you soon in Soustons!\n${NOM_MAISON}` },
  de: { sujet: "Ihre Buchungsanfrage", texte: (d) =>
    `Hallo ${d.nom},\n\nwir haben Ihre Anfrage für den Zeitraum ${d.du} bis ${d.au} erhalten (voraussichtlicher Gesamtpreis: ${d.total} €).\n` +
    `Wir melden uns innerhalb von ${EXPIRATION_JOURS} Tagen zur Bestätigung.\n\nBis bald in Soustons!\n${NOM_MAISON}` },
  es: { sujet: "su solicitud de reserva", texte: (d) =>
    `Hola ${d.nom}:\n\nHemos recibido su solicitud para el periodo del ${d.du} al ${d.au} (total estimado: ${d.total} €).\n` +
    `Le responderemos en un plazo de ${EXPIRATION_JOURS} días para confirmarla.\n\n¡Hasta pronto en Soustons!\n${NOM_MAISON}` },
  nl: { sujet: "je boekingsaanvraag", texte: (d) =>
    `Hallo ${d.nom},\n\nWe hebben je aanvraag voor de periode ${d.du} tot ${d.au} ontvangen (geschat totaal: € ${d.total}).\n` +
    `We reageren binnen ${EXPIRATION_JOURS} dagen om te bevestigen.\n\nTot snel in Soustons!\n${NOM_MAISON}` },
};

/* ---------- Outils ---------- */
function feuille() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet();
  let f = classeur.getSheetByName(FEUILLE);
  if (!f) {
    f = classeur.insertSheet(FEUILLE);
    f.appendRow(COLONNES);
    f.setFrozenRows(1);
    f.getRange("B:C").setNumberFormat("@"); // dates gardées en texte AAAA-MM-JJ
  }
  return f;
}

// Lit le tableau et normalise : statut sans accent ni majuscule, dates en texte AAAA-MM-JJ
function lireLignes() {
  const valeurs = feuille().getDataRange().getValues().slice(1);
  const enTexte = (v) => v instanceof Date
    ? Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd")
    : String(v).trim();
  return valeurs
    .filter((v) => v[1] && v[2])
    .map((v) => ({
      statut: String(v[0]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim(),
      du: enTexte(v[1]),
      au: enTexte(v[2]),
      demandeLe: v[13] instanceof Date ? v[13].toISOString() : null,
    }));
}

function expiree(ligne) {
  if (ligne.statut !== "demande" || !ligne.demandeLe) return false;
  return Date.now() - new Date(ligne.demandeLe).getTime() > EXPIRATION_JOURS * 86400000;
}

function json(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(ContentService.MimeType.JSON);
}

// À lancer une fois à la main depuis l'éditeur : crée l'onglet et demande les autorisations
function installer() {
  feuille();
  Logger.log("Onglet « " + FEUILLE + " » prêt.");
}
