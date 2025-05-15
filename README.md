# Projet 7 - Les Petits Plats

**Site de recettes de cuisine** offrant une recherche rapide, fluide et accessible, avec filtres par tags

---

## 🚀 Présentation

Après des années d’édition de livres de cuisine, l’entreprise se digitalise avec un site de recettes événementiel. Ce projet front-end, réalisé à partir d’un fichier JSON de 50 recettes et d’une maquette Figma, propose :

- Intégration de la maquette UI responsive avec **Tailwind CSS** - [Voir la maquette Figma](https://www.figma.com/design/LY5VQTAqnrAf0bWObOBrt8/Les-petits-plats---Maquette-2.0?node-id=92391-1638&t=yVtZDNCPVTnvnngb-0)

- Recherche principale texte (≥ 3 caractères)
- Filtres dynamiques par **ingrédients**, **appareils** et **ustensiles**
- Suppression automatique des tags sélectionnés
- Navigation clavier (flèches + Entrée)

Deux implémentations de l’algorithme de recherche ont été développées :

1. **Boucles natives** (`for`, `while`)
2. **Programmation fonctionnelle** (`filter`, `map`)

Un benchmark via [Jsben.ch](https://jsben.ch) sur 1000 recettes simulées a permis de comparer leurs performances.

---

## 📦 Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/thealamenthed/p7.git
   cd les-petits-plats
   ```
2. Installer les dépendances (Tailwind, …) :
   ```bash
   npm install
   ```
3. Générer le CSS :
   ```bash
   npm run build:css
   ```
4. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
5. Ouvrir [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## ⚙️ Structure du projet

```bash
src/
├── assets/ # Images et icônes
├── css/ # Styles (Tailwind output)
├── js/
│ ├── app.js # Point d’entrée
│ ├── controllers/
│ │ ├── uiController.js # Affichage cartes & badges
│ │ ├── searchWithLoops.js # Recherche avec boucles
│ │ └── searchWithArrayMethods.js # Recherche fonctionnelle
│ ├── components/ # UI (cards, dropdowns, badges)
│ ├── services/ # Filtrage tags
│ └── utils/ # Helpers (normalize, tagUtils)
└── data/ # recipes.json

```

---

## 🎯 Utilisation

- **Recherche** : taper au moins 3 caractères pour filtrer nom + description
- **Filtres** : ouvrir un dropdown, sélectionner un tag ou naviguer au clavier
- **Suppression** : cliquer sur la croix du badge ou valider un tag sélectionné

### Basculer entre les branches

Pour comparer les deux implémentations, utilisez les branches Git dédiées :

```
git checkout feat/search-with-loops # version avec boucles natives
```

# ou

```
git checkout feat/search-with-array-methods # version fonctionnelle
```

## 📊 Benchmark

### Implémentation

| Méthode                     | Ops/sec (moyenne) |
| --------------------------- | ----------------- |
| Boucles natives             | ~7 750            |
| Programmation fonctionnelle | ~7 780            |

🎯 **Conclusion** : Les performances sont quasi-identiques

✅ La version **fonctionnelle** est recommandée pour sa **lisibilité** et sa **maintenabilité**

## 🛠️ Développement

- **Green Code** :  
  Fonctions pures, découpage modulaire, évite tout accès DOM inutile

- **Accessibilité** :  
  Navigation au clavier, normalisation des entrées pour éviter l’injection HTML

- **Responsive** :  
  Grille responsive avec Tailwind, adaptée du mobile au desktop
