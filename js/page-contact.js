// PAGE CONTACT : téléphone et formulaire de message
afficherPage = () => {
  $("lien-telephone").href = "tel:" + CONFIG.telephone.replace(/\s/g, "");
  $("lien-telephone").textContent = remplir(T.contact.appeler, { telephone: CONFIG.telephone });
};

$("formulaire").addEventListener("submit", async (e) => {
  e.preventDefault();
  const champs = Object.fromEntries(new FormData(e.target));
  if (champs.site_web) return; // rempli = robot : on ignore
  $("envoyer").disabled = true;
  $("erreur").hidden = true;
  try {
    const resultat = await envoyerMessage({ nom: champs.nom, email: champs.email, message: champs.message, langue });
    if (!resultat.ok) throw new Error();
    $("formulaire").hidden = true;
    $("merci").hidden = false;
  } catch (err) {
    $("erreur").textContent = T.contact.erreur;
    $("erreur").hidden = false;
    $("envoyer").disabled = false;
  }
});
