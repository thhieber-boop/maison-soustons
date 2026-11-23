// PAGE AUTOUR DE SOUSTONS : une carte par lieu
afficherPage = () => {
  const avecPhoto = CONFIG.lieux.filter((l) => l.photo).map((l) => l.photo);
  $("lieux").innerHTML = CONFIG.lieux
    .map((l) => {
      const t = T.lieux[l.cle];
      const image = l.photo
        ? `<button class="lieu-photo" data-serie="${avecPhoto}" data-index="${avecPhoto.indexOf(l.photo)}">
             <img src="${photo(l.photo)}" alt="${t.nom}" loading="lazy"></button>`
        : "";
      return `
        <article class="lieu ${l.photo ? "" : "lieu-sans-photo"}">
          ${image}
          <div class="lieu-texte">
            <p class="lieu-distance">${t.distance}</p>
            <h2>${t.nom}</h2>
            <p>${t.texte}</p>
          </div>
        </article>`;
    })
    .join("");
};
