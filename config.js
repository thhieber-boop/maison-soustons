/*
  ============================================================
  DONNÉES DU SITE (communes à toutes les langues)
  ============================================================
  Ici : prix, saisons, réservations, services, coordonnées.
  Les TEXTES sont dans le dossier textes/ (un fichier par langue).
  Les PHOTOS sont rangées par pièce dans photos-originales/ (voir outils/optimiser_photos.py).

  Règles simples pour ne rien casser :
  - Le texte est toujours entre guillemets : "comme ceci"
  - Chaque élément d'une liste se termine par une virgule
  - Les prix sont des nombres, SANS guillemets ni symbole € : 2600
  - Les dates s'écrivent "AAAA-MM-JJ" : "2027-07-03" = 3 juillet 2027
  Après une modification, enregistre le fichier et recharge la page.
*/

const CONFIG = {

  // ---------- Identité ----------
  nom: "Villa des Vergnes",
  telephone: "+33 6 01 03 79 85",
  email: "th.hieber@gmail.com",

  // ---------- Langues ----------
  // L'ordre ici = l'ordre dans le sélecteur. La 1re sert par défaut.
  langues: ["fr", "en", "de", "es", "nl"],

  // ---------- Photo de fond de l'accueil ----------
  // "dossier/nom" d'une photo de photos-originales (sans .jpg)
  photoAccueil: "autour-de-soustons/16-lac-coucher-soleil-juillet",

  // ---------- Image de fond de chaque page ----------
  // "dossier/nom" d'une photo de photos-originales (sans .jpg)
  fondsPages: {
    accueil: "autour-de-soustons/14-lac-bord-arbres",
    maison: "autour-de-soustons/16-lac-coucher-soleil-juillet",
    photos: "autour-de-soustons/15-lac-bord-arbres-2",
    autour: "autour-de-soustons/14-lac-bord-arbres",
    tarifs: "autour-de-soustons/16-lac-coucher-soleil-juillet",
    reserver: "autour-de-soustons/15-lac-bord-arbres-2",
    contact: "autour-de-soustons/16-lac-coucher-soleil-juillet",
  },

  // ---------- La maison ----------
  chiffres: [
    { valeur: "8-9", cle: "personnes" },
    { valeur: "4", cle: "chambres" },
    { valeur: "160 m²", cle: "habitables" },
    { valeur: "1 300 m²", cle: "jardin" },
    { valeur: "9 × 4 m", cle: "piscine" },
  ],
  // Les pièces présentées dans « La maison », dans cet ordre.
  // Chaque nom = un dossier de photos-originales ; les textes sont dans textes/xx.js (rubrique pieces)
  pieces: [
    "sejour-cuisine",
    "jardin-terrasses",
    "piscine",
    "chambre-1",
    "chambre-2",
    "chambre-bleue-1",
    "chambre-bleue-2",
    "palier-etage",
    "salle-d-eau-bas",
    "salle-de-bains-haut",
  ],

  // ---------- Autour de Soustons ----------
  // "photo" : facultatif, "dossier/nom" d'une photo. Les textes sont dans textes/xx.js (rubrique lieux)
  lieux: [
    { cle: "lac", photo: "autour-de-soustons/14-lac-bord-arbres" },
    { cle: "tourLac", photo: "autour-de-soustons/07-lac-ponton-arbre" },
    { cle: "vergnes", photo: null },
    { cle: "ocean", photo: "autour-de-soustons/17-ocean-coucher-soleil" },
    { cle: "velo", photo: "autour-de-soustons/11-parc-lac" },
    { cle: "paddle", photo: "autour-de-soustons/04-lac-paddle" },
    { cle: "marche", photo: null },
    { cle: "vieuxBoucau", photo: null },
    { cle: "hossegor", photo: "autour-de-soustons/18-plage-hossegor" },
    { cle: "huchet", photo: null },
    { cle: "paysBasque", photo: null },
  ],

  // ============================================================
  // RÉSERVATIONS
  // ============================================================

  // Liaison avec le Google Sheet (voir outils/google-apps-script.js).
  // Tant que c'est vide "", le site fonctionne en MODE ESSAI :
  // les demandes ne sont enregistrées que dans le navigateur de celui qui les fait.
  urlScriptGoogle: "",

  // Une demande non confirmée redevient disponible au bout de ce nombre de jours
  expirationDemandeJours: 3,

  // Prix par saison. null = formule impossible dans cette saison.
  saisons: {
    tresHaute: { prixSemaine: 2800, prixWeekEnd: null },
    haute:     { prixSemaine: 2200, prixWeekEnd: null },
    moyenne:   { prixSemaine: 1500, prixWeekEnd: 750 },
    basse:     { prixSemaine: 1000, prixWeekEnd: 500 },
  },

  // Calendrier des saisons. "du" = un samedi (inclus), "au" = le samedi de fin (exclu).
  // La 1re ligne fixe l'ouverture des réservations, la dernière la fin.
  // Pour ouvrir 2028 : ajouter les lignes de 2028 à la suite.
  periodes: [
    { du: "2027-01-02", au: "2027-05-29", saison: "basse" },
    { du: "2027-05-29", au: "2027-07-03", saison: "moyenne" },
    { du: "2027-07-03", au: "2027-07-17", saison: "haute" },
    { du: "2027-07-17", au: "2027-08-21", saison: "tresHaute" },
    { du: "2027-08-21", au: "2027-08-28", saison: "haute" },
    { du: "2027-08-28", au: "2027-09-25", saison: "moyenne" },
    { du: "2027-09-25", au: "2028-01-01", saison: "basse" },
  ],

  // Formules de location :
  // - semaine : du samedi au samedi (toutes saisons, plusieurs semaines possibles)
  // - week-end : 3 nuits du vendredi au lundi (seulement si la saison a un prixWeekEnd)

  // Périodes déjà prises, en plus de celles du Google Sheet.
  // statut : "reserve" (réservé) ou "demande" (demande en cours)
  // Exemple :  { du: "2027-08-07", au: "2027-08-14", statut: "reserve" },
  occupations: [
  ],

  // ---------- Services ----------
  // unite : "sejour" (une fois par séjour) ou "semaine" (par semaine, le week-end compte pour 1)
  // obligatoire : true = toujours inclus. max = nombre maximum (ex. 2 vélos)
  // Les noms traduits sont dans textes/xx.js (rubrique services)
  services: [
    { cle: "menage", prix: 150, unite: "sejour", obligatoire: true },
    { cle: "veloEnfant", prix: 25, unite: "semaine", max: 2 },
  ],
  caution: 1000,
  personnesMax: 9,
};
