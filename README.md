# prismegfm.com

Site statique bilingue de Prisme GFM (HTML + CSS, aucun framework, aucun traceur).

- `index.html` : français
- `en/index.html` : anglais
- `assets/style.css` : styles et palette (bleu #32BEC1, rouge #FF3D4A, orange #FF8A00, jaune #FFD100)
- `assets/fonts/` : Montserrat hébergée localement (licence OFL), donc aucun appel à Google Fonts
- `assets/hero.js` : animation du logo (s'arrête hors écran et respecte le réglage « réduire les animations »)
- `assets/og-fr.jpg`, `og-en.jpg` : images d'aperçu pour LinkedIn et les messageries
- `CNAME` : le domaine utilisé par GitHub Pages

## Mise en ligne sur GitHub Pages

1. Créer un dépôt public sur GitHub (ex. `prismegfm`) et y téléverser tout le contenu de ce dossier.
2. Dans le dépôt : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Dans **Custom domain**, inscrire `prismegfm.com`, puis cocher **Enforce HTTPS** une fois disponible.

## DNS chez Squarespace (Domains → prismegfm.com → DNS)

Enregistrements A (hôte `@`) :

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Enregistrement CNAME : hôte `www` → `<votre-nom-utilisateur>.github.io`

**Ne pas toucher aux enregistrements MX et TXT** : ils font fonctionner genevieve@prismegfm.com (Google Workspace). Remplacer seulement les enregistrements A et CNAME `www` qui pointent vers Squarespace. La propagation prend de quelques minutes à quelques heures.

## Modifier le contenu

Modifier directement `index.html` et `en/index.html`.
