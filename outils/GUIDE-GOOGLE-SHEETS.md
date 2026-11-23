# Brancher le site sur Google Sheets (environ 10 minutes)

Tant que ce n'est pas fait, la page Réserver fonctionne en **mode essai** :
les demandes restent dans le navigateur de celui qui les fait, et aucun e-mail n'est envoyé.

## 1. Créer le tableau
1. Va sur https://sheets.google.com avec ton compte th.hieber@gmail.com.
2. Crée un tableau vide et nomme-le « Villa des Vergnes – Réservations ».

## 2. Coller le script
1. Dans le tableau : menu **Extensions → Apps Script**.
2. Efface le contenu affiché et colle tout le fichier `outils/google-apps-script.js`.
3. Enregistre (icône disquette).
4. En haut, choisis la fonction **installer**, puis clique **Exécuter**.
   Google demande des autorisations (lire le tableau, envoyer des e-mails) : accepte.
   Un onglet « Réservations » apparaît dans le tableau.

## 3. Publier le script
1. Bouton **Déployer → Nouveau déploiement**.
2. Type : **Application Web**.
3. « Exécuter en tant que » : **Moi**. « Qui a accès » : **Tout le monde**.
4. Clique **Déployer** et copie l'**URL de l'application Web** (elle se termine par `/exec`).

## 4. Relier le site
Dans `config.js`, colle l'URL entre les guillemets :
```js
urlScriptGoogle: "https://script.google.com/macros/s/……/exec",
```
Le bandeau « Mode essai » disparaît : les demandes arrivent dans le tableau et les e-mails partent.

## Au quotidien
| Je veux…                         | Dans le tableau, colonne Statut |
|----------------------------------|---------------------------------|
| confirmer une demande            | remplacer `demande` par `réservé` |
| refuser / annuler                | `annulé` (ou supprimer la ligne) |
| bloquer des dates pour la famille | ajouter une ligne : `réservé`, arrivée, départ (format 2027-08-07) |

Une `demande` sans réponse redevient disponible au bout de 3 jours (réglable en haut du script).

**Si tu modifies le script plus tard** : Déployer → Gérer les déploiements → crayon → Version : « Nouvelle version » → Déployer. L'URL reste la même.
