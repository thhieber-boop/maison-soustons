// PAGE PHOTOS : toutes les photos, regroupées par pièce, avec filtres
let pieceChoisie = "tout";

afficherPage = () => {
  const pieces = [...CONFIG.pieces, "autour-de-soustons"].filter((p) => photosDe(p).length);

  $("filtres").innerHTML = ["tout", ...pieces]
    .map((p) => `<button class="filtre ${p === pieceChoisie ? "actif" : ""}" data-piece="${p}">
      ${p === "tout" ? T.photos.tout : T.pieces[p].nom}</button>`)
    .join("");

  $("galerie").innerHTML = pieces
    .filter((p) => pieceChoisie === "tout" || p === pieceChoisie)
    .map((p) => {
      const serie = photosDe(p);
      return `
        <h2 class="galerie-titre">${T.pieces[p].nom} <span>${serie.length}</span></h2>
        <div class="galerie">
          ${serie.map((c, i) => `
            <button class="vignette" data-serie="${serie}" data-index="${i}">
              <img src="${photo(c)}" alt="${legende(c)}" loading="lazy">
            </button>`).join("")}
        </div>`;
    })
    .join("");
};

$("filtres").addEventListener("click", (e) => {
  const bouton = e.target.closest(".filtre");
  if (!bouton) return;
  pieceChoisie = bouton.dataset.piece;
  afficherPage();
});
