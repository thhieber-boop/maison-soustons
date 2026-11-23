/*
  TEXTES EN FRANÇAIS
  Les mots entre accolades, comme {prix} ou {n}, sont remplacés
  automatiquement par des valeurs : ne pas les traduire.
*/
window.TEXTES = window.TEXTES || {};
TEXTES.fr = {
  nomLangue: "Français",
  descriptionSite: "Maison familiale de 160 m² avec piscine chauffée pour 8 à 9 personnes, à 10 minutes à pied du lac de Soustons (Landes).",

  // ---------- Menu (toutes les pages) ----------
  menu: {
    accueil: "Accueil",
    maison: "La maison",
    photos: "Photos",
    autour: "Autour de Soustons",
    tarifs: "Tarifs",
    reserver: "Réserver",
    contact: "Contact",
    ouvrir: "Ouvrir le menu",
  },
  pied: "Soustons, Landes",

  // ---------- Accueil ----------
  accueil: {
    titrePage: "Maison de vacances avec piscine à Soustons",
    surtitre: "Soustons · Landes",
    sousTitre: "Maison de vacances avec piscine, à 10 minutes à pied du lac",
    bouton: "Voir les disponibilités",
    boutonMaison: "Découvrir la maison",
    titreAtouts: "Des vacances en famille, entre lac et océan",
    atouts: [
      { icone: "🏊", titre: "Piscine chauffée", texte: "9 × 4 m, chauffée de fin mai à fin septembre, au milieu d'un jardin de 1 300 m²." },
      { icone: "🌅", titre: "Le lac à pied", texte: "10 minutes de marche jusqu'au lac de Soustons et la pointe des Vergnes." },
      { icone: "🚲", titre: "L'océan à vélo", texte: "6 km de pistes cyclables jusqu'aux plages de l'Atlantique." },
      { icone: "👨‍👩‍👧‍👦", titre: "Jusqu'à 9 personnes", texte: "4 chambres, une grande pièce de vie et une cuisine très équipée." },
    ],
    titrePhotos: "Un aperçu",
    voirPhotos: "Voir toutes les photos",
  },

  // ---------- La maison ----------
  maison: {
    titrePage: "La maison",
    titre: "Une maison pensée pour les vacances en famille",
    intro: "Construite en 2016, la maison a été conçue pour la convivialité : un grand séjour ouvert sur la terrasse et la piscine, une cuisine où l'on aime cuisiner ensemble, et des chambres réparties sur deux niveaux pour que chacun ait son coin.",
    photos: "{n} photos",
    titreEquipements: "Équipements",
    titreSituation: "Situation",
    titreRegles: "Bon à savoir",
  },
  chiffres: {
    personnes: "personnes",
    chambres: "chambres",
    habitables: "habitables",
    jardin: "de jardin",
    piscine: "piscine chauffée",
  },
  // Une rubrique par dossier de photos
  pieces: {
    "piscine": { nom: "La piscine", niveau: "", texte: "Piscine de 9 × 4 m chauffée par pompe à chaleur, ouverte de fin mai à fin septembre. Transats et plage autour du bassin." },
    "jardin-terrasses": { nom: "Jardin et terrasses", niveau: "", texte: "1 300 m² de jardin fleuri, une terrasse couverte, un salon de jardin et deux barbecues (charbon et électrique)." },
    "sejour-cuisine": { nom: "Séjour et cuisine", niveau: "Rez-de-chaussée", texte: "Grande pièce de vie lumineuse ouverte sur la terrasse, téléviseur 85 pouces, table pour toute la tribu. Cuisine très bien équipée : vaisselle complète, robot Kenwood Major, lave-vaisselle." },
    "chambre-1": { nom: "Chambre 1", niveau: "Rez-de-chaussée", texte: "2 lits 80 × 200, regroupables en un grand lit, vue sur la piscine." },
    "chambre-2": { nom: "Chambre 2", niveau: "Rez-de-chaussée", texte: "Lit 160 × 200, dressing et rangements." },
    "chambre-bleue-1": { nom: "Chambre bleue 1", niveau: "Étage", texte: "Lit 160 × 200." },
    "chambre-bleue-2": { nom: "Chambre bleue 2", niveau: "Étage", texte: "Lit 160 × 200, dressing." },
    "palier-etage": { nom: "Palier de l'étage", niveau: "Étage", texte: "Grand palier sous les poutres, avec sa bibliothèque." },
    "salle-d-eau-bas": { nom: "Salle d'eau", niveau: "Rez-de-chaussée", texte: "Douche, lavabo et rangements." },
    "salle-de-bains-haut": { nom: "Salle de bains", niveau: "Étage", texte: "Baignoire, douche et vasque." },
    "autour-de-soustons": { nom: "Autour de Soustons", niveau: "", texte: "" },
  },
  equipements: [
    "Wifi",
    "Téléviseur 85 pouces",
    "Lave-vaisselle et lave-linge",
    "Barbecue charbon et barbecue électrique",
    "3 places de parking",
    "Lit simple d'appoint 70 × 190",
    "Lit bébé",
    "Lits faits à l'arrivée, linge de maison fourni",
  ],
  situation: [
    "10 minutes à pied du lac de Soustons et de la pointe des Vergnes",
    "600 m de la place du marché",
    "6 km de l'océan, accessible directement par les pistes cyclables",
  ],
  regles: [
    "Animaux non acceptés",
    "Non-fumeur à l'intérieur",
    "Juillet-août : location à la semaine, du samedi au samedi",
    "Le reste de l'année : à la semaine ou en week-end de 3 nuits",
  ],

  // ---------- Photos ----------
  photos: {
    titrePage: "Photos",
    titre: "Photos",
    tout: "Tout",
  },
  // Légendes particulières (facultatif). Sinon, la légende est le nom de la pièce.
  legendes: {
    "sejour-cuisine/09-couloir": "Le couloir du rez-de-chaussée",
    "autour-de-soustons/14-lac-bord-arbres": "Le bord du lac de Soustons, entre les arbres",
    "autour-de-soustons/15-lac-bord-arbres-2": "Le bord du lac de Soustons, entre les arbres",
    "autour-de-soustons/16-lac-coucher-soleil-juillet": "Coucher de soleil sur le lac de Soustons",
    "autour-de-soustons/17-ocean-coucher-soleil": "Coucher de soleil sur l'océan",
    "autour-de-soustons/18-plage-hossegor": "Fin de journée sur la plage",
    "autour-de-soustons/19-estacade-coucher-soleil": "Coucher de soleil sur l'océan",
    "autour-de-soustons/20-coucher-soleil-pins": "Coucher de soleil derrière les pins",
    "piscine/04-vue-etage-retouchee": "Vue sur la piscine depuis l'étage",
    "piscine/05-vue-etage-retouchee-2": "Vue sur la piscine depuis l'étage",
    "autour-de-soustons/01-lac-coucher-soleil": "Coucher de soleil sur le lac de Soustons",
    "autour-de-soustons/02-lac-ile-automne": "L'île du lac en automne",
    "autour-de-soustons/03-lac-plage": "Plage du lac de Soustons",
    "autour-de-soustons/04-lac-paddle": "Paddle sur le lac",
    "autour-de-soustons/05-lac-ponton-soir": "Le soir, depuis un ponton",
    "autour-de-soustons/06-ocean-plage": "L'océan, à 6 km à vélo",
    "autour-de-soustons/07-lac-ponton-arbre": "Le ponton d'Azur, sur le tour du lac",
    "autour-de-soustons/08-lac-port": "Le port du lac",
    "autour-de-soustons/09-lac-reflets": "Reflets sur le lac",
    "autour-de-soustons/10-lac-canal": "Le canal en automne",
    "autour-de-soustons/11-parc-lac": "Balade au bord du lac",
    "autour-de-soustons/12-lac-coucher-soleil-arbres": "Coucher de soleil entre les arbres",
    "autour-de-soustons/13-lac-plage-pins": "Plage et pins au bord du lac",
  },

  // ---------- Autour de Soustons ----------
  autour: {
    titrePage: "Autour de Soustons",
    titre: "À faire autour de Soustons",
    intro: "Entre le lac, la forêt de pins et l'océan, Soustons se vit à pied et à vélo. Nos idées pour profiter du séjour :",
  },
  lieux: {
    lac: { nom: "Le lac de Soustons", distance: "10 min à pied", texte: "Balades sur les berges, petites plages, baignade et pique-nique à l'ombre des pins." },
    vergnes: { nom: "La pointe des Vergnes", distance: "10 min à pied", texte: "Un joli coin du lac, à 10 minutes à pied de la maison, idéal pour profiter du coucher de soleil." },
    tourLac: { nom: "Le tour du lac et le ponton d'Azur", distance: "Autour du lac", texte: "Une belle balade le long des berges du lac de Soustons, avec une halte au ponton d'Azur et sa vue sur l'eau." },
    ocean: { nom: "Les plages de l'océan", distance: "6 km à vélo", texte: "Soustons Plage et ses dunes, accessibles par les pistes cyclables à travers la forêt. Surf, baignade surveillée l'été." },
    velo: { nom: "Les pistes cyclables", distance: "Depuis la maison", texte: "Un réseau de pistes plates et ombragées pour rejoindre le lac, l'océan et les villages voisins en famille." },
    paddle: { nom: "Paddle, canoë et voile", distance: "Sur le lac", texte: "Le lac, calme et peu profond, est idéal pour s'initier aux sports nautiques avec les enfants." },
    marche: { nom: "Le marché de Soustons", distance: "600 m", texte: "Produits landais, fruits et légumes, canard et fromages, à deux pas de la maison." },
    vieuxBoucau: { nom: "Vieux-Boucau et Port d'Albret", distance: "15 min en voiture", texte: "Le lac marin, idéal pour la baignade des petits, la promenade et les terrasses." },
    hossegor: { nom: "Hossegor et Seignosse", distance: "25 min en voiture", texte: "Spots de surf réputés, lac marin d'Hossegor, boutiques et restaurants." },
    huchet: { nom: "Le courant d'Huchet", distance: "30 min en voiture", texte: "Réserve naturelle à découvrir à pied ou en barque traditionnelle, entre forêt et océan." },
    paysBasque: { nom: "Biarritz et le Pays basque", distance: "50 min en voiture", texte: "Pour une journée : Biarritz, Bayonne, Saint-Jean-de-Luz et les villages basques." },
  },

  // ---------- Tarifs ----------
  tarifs: {
    titrePage: "Tarifs",
    titre: "Tarifs",
    intro: "Prix pour la maison entière, quel que soit le nombre de personnes.",
    saisons: {
      tresHaute: "Très haute saison",
      haute: "Haute saison",
      moyenne: "Moyenne saison",
      basse: "Basse saison",
    },
    parSemaine: "/ semaine",
    weekEnd: "{prix} le week-end (3 nuits)",
    semaineSeulement: "À la semaine uniquement",
    titreServices: "Services",
    titreConditions: "Conditions",
    conditions: [
      "Semaine : du samedi au samedi",
      "Week-end : 3 nuits, du vendredi au lundi (hors juillet-août)",
      "Lits faits à l'arrivée, linge de maison fourni",
      "Caution : {caution}, restituée après l'état des lieux",
      "Taxe de séjour en supplément",
    ],
    bouton: "Voir les disponibilités",
  },
  services: {
    menage: { nom: "Ménage de fin de séjour", detail: "obligatoire" },
    veloEnfant: { nom: "Vélo enfant (9-12 ans)", detail: "par vélo et par semaine" },
  },
  unites: { sejour: "par séjour", semaine: "par semaine" },

  // ---------- Réserver ----------
  reserver: {
    titrePage: "Réserver",
    titre: "Disponibilités et réservation",
    intro: "Choisissez une semaine (du samedi au samedi) ou, hors juillet-août, un week-end de 3 nuits. Pour plusieurs semaines, cliquez sur les semaines qui se suivent.",
    etats: {
      disponible: "Disponible",
      demande: "Demande en cours",
      reserve: "Réservé",
      selection: "Votre choix",
    },
    semaine: "Semaine",
    weekEnd: "Week-end",
    moisPrecedent: "Mois précédent",
    moisSuivant: "Mois suivant",
    titreRecap: "Votre séjour",
    aucuneSelection: "Choisissez d'abord une période dans le calendrier.",
    arrivee: "Arrivée",
    depart: "Départ",
    nuits: "{n} nuits",
    location: "Location",
    total: "Total estimé",
    caution: "Caution de {caution} à prévoir, taxe de séjour en supplément.",
    titreFormulaire: "Vos coordonnées",
    nom: "Nom et prénom",
    email: "E-mail",
    telephone: "Téléphone",
    adultes: "Adultes",
    enfants: "Enfants",
    message: "Message (facultatif)",
    envoyer: "Envoyer ma demande",
    envoiEnCours: "Envoi…",
    note: "Ceci est une demande, pas un paiement. Nous vous répondons rapidement pour confirmer.",
    merciTitre: "Merci, votre demande est envoyée !",
    merciTexte: "La période apparaît maintenant comme « demande en cours ». Vous allez recevoir un e-mail de confirmation, et nous revenons vers vous sous {jours} jours.",
    nouvelleDemande: "Faire une autre demande",
    erreur: "L'envoi n'a pas fonctionné. Réessayez ou appelez-nous au {telephone}.",
    plusDisponible: "Désolé, cette période vient d'être prise. Choisissez-en une autre.",
    tropDePersonnes: "La maison accueille {n} personnes au maximum.",
    modeEssai: "Mode essai : les demandes ne sont enregistrées que dans ce navigateur, aucun e-mail n'est envoyé.",
  },

  // ---------- Contact ----------
  contact: {
    titrePage: "Contact",
    titre: "Une question ?",
    intro: "Appelez-nous ou écrivez-nous, nous répondons volontiers. Pour réserver, passez par la page Réserver.",
    appeler: "📞 {telephone}",
    nom: "Nom",
    email: "E-mail",
    message: "Votre message",
    envoyer: "Envoyer",
    merci: "Merci ! Votre message est envoyé, nous vous répondons rapidement.",
    erreur: "L'envoi n'a pas fonctionné. Réessayez ou appelez-nous.",
  },

  galerie: { fermer: "Fermer", precedente: "Photo précédente", suivante: "Photo suivante" },
};
