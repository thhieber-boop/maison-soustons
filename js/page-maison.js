// PAGE LA MAISON : chiffres clés, puis chaque pièce avec sa description et ses photos
afficherPage = () => {
  $("liste-chiffres").innerHTML = CONFIG.chiffres
    .map((c) => `<li><strong>${c.valeur}</strong><span>${T.chiffres[c.cle]}</span></li>`)
    .join("");

  $("pieces").innerHTML = CONFIG.pieces
    .map((piece) => {
      const texte = T.pieces[piece];
      const serie = photosDe(piece); // toutes les photos de cette pièce
      // data-serie : un clic ouvre la visionneuse avec les photos de cette pièce seulement
      const vignettes = serie
        .map((c, i) => `
          <button class="vignette ${i === 0 ? "vignette-principale" : ""}" data-serie="${serie}" data-index="${i}">
            <img src="${photo(c)}" alt="${texte.nom}" loading="lazy">
          </button>`)
        .join("");
      return `
        <article class="piece" id="${piece}">
          <div class="piece-texte">
            ${texte.niveau ? `<p class="piece-niveau">${texte.niveau}</p>` : ""}
            <h2>${texte.nom}</h2>
            <p>${texte.texte}</p>
            ${serie.length ? `<button class="lien-fleche" data-serie="${serie}" data-index="0">📷 ${remplir(T.maison.photos, { n: serie.length })}</button>` : ""}
          </div>
          <div class="piece-photos nb-${Math.min(serie.length, 3)}">${vignettes}</div>
        </article>`;
    })
    .join("");

  const liste = (id, textes) => ($(id).innerHTML = textes.map((t) => `<li>${t}</li>`).join(""));
  liste("liste-equipements", T.equipements);
  liste("liste-situation", T.situation);
  liste("liste-regles", T.regles);
};
