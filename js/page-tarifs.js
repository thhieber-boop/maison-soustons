// PAGE TARIFS : une carte par saison (dates calculées depuis config.js), services, conditions
afficherPage = () => {
  const court = { day: "numeric", month: "short" };

  $("grille-tarifs").innerHTML = Object.entries(CONFIG.saisons)
    .map(([cle, s]) => {
      // toutes les périodes de cette saison, ex. « 3 juil. → 17 juil. »
      const dates = CONFIG.periodes
        .filter((p) => p.saison === cle)
        .map((p) => `${formatDate(versJour(p.du), court)} → ${formatDate(versJour(p.au), court)}`)
        .join("<br>");
      return `
        <article class="tarif tarif-${cle}">
          <h3>${T.tarifs.saisons[cle]}</h3>
          <p class="tarif-periode">${dates}</p>
          <p class="tarif-prix">${euros(s.prixSemaine)} <span>${T.tarifs.parSemaine}</span></p>
          <p class="tarif-we">${s.prixWeekEnd ? remplir(T.tarifs.weekEnd, { prix: euros(s.prixWeekEnd) }) : T.tarifs.semaineSeulement}</p>
        </article>`;
    })
    .join("");

  $("liste-services").innerHTML = CONFIG.services
    .map((s) => `<li><span>${T.services[s.cle].nom}<small>${T.services[s.cle].detail}</small></span><strong>${euros(s.prix)}</strong></li>`)
    .join("");
  $("liste-conditions").innerHTML = T.tarifs.conditions
    .map((c) => `<li>${remplir(c, { caution: euros(CONFIG.caution) })}</li>`)
    .join("");
  $("bouton-reserver").href = lien("reserver");
};
