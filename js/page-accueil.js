// PAGE ACCUEIL : grande photo, atouts, bandeau de photos
afficherPage = () => {
  $("photo-accueil").src = photo(CONFIG.photoAccueil, "grand");
  $("photo-accueil").alt = legende(CONFIG.photoAccueil);
  $("nom-maison").textContent = CONFIG.nom;
  $("bouton-reserver").href = lien("reserver");
  $("bouton-maison").href = lien("maison");
  $("lien-photos").href = lien("photos");

  $("atouts").innerHTML = T.accueil.atouts
    .map((a) => `<li><span class="atout-icone">${a.icone}</span><h3>${a.titre}</h3><p>${a.texte}</p></li>`)
    .join("");

  // La 1re photo de chaque pièce de la maison
  const serie = CONFIG.pieces.map((p) => photosDe(p)[0]).filter(Boolean);
  $("bandeau-photos").innerHTML = serie
    .slice(0, 6)
    .map((c, i) => `<img src="${photo(c)}" alt="${legende(c)}" loading="lazy" data-serie="${serie}" data-index="${i}">`)
    .join("");
};
