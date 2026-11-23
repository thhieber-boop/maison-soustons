"""
Optimise les photos pour le web et met à jour la liste des photos du site.

Fonctionnement :
  - les photos d'origine sont rangées par pièce dans  Site internet/photos-originales/<piece>/
  - le numéro au début du nom fixe l'ordre d'affichage (01 = photo principale de la pièce)
  - pour chaque photo, l'outil crée dans site/photos/<piece>/ deux versions WebP (format léger) :
        <nom>-grand.webp  (1600 px, plein écran)     <nom>-petit.webp  (640 px, vignettes)
  - puis il écrit site/photos/liste-photos.js, que le site lit pour savoir quelles photos existent

Pour ajouter une photo : dépose-la dans le bon dossier de photos-originales, puis lance
(depuis le dossier site/) :     python3 outils/optimiser_photos.py
Pour retirer une photo : supprime-la de photos-originales et relance l'outil.
"""
import json, os, shutil
from PIL import Image, ImageOps

ICI = os.path.dirname(os.path.abspath(__file__))
ORIGINAUX = os.path.join(ICI, "..", "..", "photos-originales")
SORTIE = os.path.join(ICI, "..", "photos")
TAILLES = {"grand": 1600, "petit": 640}
EXTENSIONS = (".jpg", ".jpeg", ".png", ".heic", ".webp")

liste = {}
for piece in sorted(os.listdir(ORIGINAUX)):
    dossier = os.path.join(ORIGINAUX, piece)
    if not os.path.isdir(dossier):
        continue
    os.makedirs(os.path.join(SORTIE, piece), exist_ok=True)
    liste[piece] = []
    for fichier in sorted(os.listdir(dossier)):
        if not fichier.lower().endswith(EXTENSIONS):
            continue
        nom = os.path.splitext(fichier)[0]
        source = os.path.join(dossier, fichier)
        liste[piece].append(nom)
        petit = os.path.join(SORTIE, piece, f"{nom}-petit.webp")
        # déjà fait et à jour ? on passe (gain de temps)
        if os.path.exists(petit) and os.path.getmtime(petit) > os.path.getmtime(source):
            continue
        image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
        for suffixe, largeur in TAILLES.items():
            copie = image.copy()
            copie.thumbnail((largeur, largeur))
            copie.save(os.path.join(SORTIE, piece, f"{nom}-{suffixe}.webp"), "WEBP", quality=80)
        print(f"ok  {piece}/{nom}")

# supprime les dossiers de pièces qui n'existent plus dans photos-originales
for piece in os.listdir(SORTIE):
    if os.path.isdir(os.path.join(SORTIE, piece)) and piece not in liste:
        shutil.rmtree(os.path.join(SORTIE, piece))

with open(os.path.join(SORTIE, "liste-photos.js"), "w", encoding="utf-8") as f:
    f.write("// Fichier créé automatiquement par outils/optimiser_photos.py : ne pas modifier à la main.\n")
    f.write("const PHOTOS = " + json.dumps(liste, indent=2, ensure_ascii=False) + ";\n")
print(sum(len(v) for v in liste.values()), "photos dans", len(liste), "pièces")
