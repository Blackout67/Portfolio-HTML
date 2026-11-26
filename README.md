# Portfolio — Joel Yapi

Développeur web et designer graphique, Abidjan.

Une page unique, fond blanc et accent rouge : accueil avec photo, services, compétences, à propos et parcours, huit projets avec fiche détaillée, méthode et contact (WhatsApp, e-mail, formulaire qui prépare le message).

## Contenu

- `index.html` : la page unique. Chaque projet a sa fiche détaillée dans un bloc `.detail` caché.
- `style.css` : mise en page responsive (ordinateur, tablette, téléphone).
- `script.js` : coordonnées (`CONTACT` en haut du fichier), menu mobile, filtre et fiches des projets, apparitions au défilement.
- `assets/` : favicon, photo, captures en WebP et CV en PDF.

Aucun framework, aucune étape de build : ouvrir `index.html` suffit.

## Lancer en local

```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Confidentialité

Le dépôt est public. Les captures ont été recadrées ou floutées pour ne montrer ni coordonnées, ni chiffres d'affaires, ni données de clients. Le code des projets clients reste dans des dépôts privés.
