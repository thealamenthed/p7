// src/js/app.js
import {normalize} from "./utils/normalization.js";
import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils
} from "./utils/tagUtils.js";
import {createTagDropdown} from "./components/tagDropdown.js";
import {filterByTagsWithLoops} from "./services/tagFilter.js";
import {renderRecipes, renderSelectedTags} from "./controllers/uiController.js";

const cardsContainer = document.querySelector("[data-recipes-list]");
const searchInput = document.querySelector("[data-recipes-search]");
const filtersContainer = document.querySelector("[data-filters]");
const selectedTagsContainer = document.querySelector("[data-selected-tags]");
const recipesCountEl = document.querySelector("[data-recipes-count]");

let recipes = [];
const selectedTags = {ingredient: [], appliance: [], ustensil: []};

function updateResults() {
  const rawQuery = searchInput.value.trim();
  const q = normalize(rawQuery);
  let results = [];

  // Recherche principale
  if (q.length >= 3) {
    for (let i = 0; i < recipes.length; i++) {
      const r = recipes[i];
      const fullText = normalize(r.name) + " " + normalize(r.description);
      if (fullText.includes(q)) {
        results.push(r);
      }
    }
  } else {
    for (let i = 0; i < recipes.length; i++) {
      results.push(recipes[i]);
    }
  }

  // Filtres par tags
  for (const type in selectedTags) {
    const tags = selectedTags[type];
    if (tags.length > 0) {
      results = filterByTagsWithLoops(results, tags, type);
    }
  }

  // Mise à jour des dropdowns avec les tags disponibles dans les résultats filtrés
  const ingredients = getUniqueIngredients(results).filter(
    (i) => !selectedTags.ingredient.includes(i)
  );
  const appliances = getUniqueAppliances(results).filter(
    (a) => !selectedTags.appliance.includes(a)
  );
  const ustensils = getUniqueUstensils(results).filter(
    (u) => !selectedTags.ustensil.includes(u)
  );

  filtersContainer.innerHTML = [
    createTagDropdown("Ingrédients", ingredients, "ingredient"),
    createTagDropdown("Appareils", appliances, "appliance"),
    createTagDropdown("Ustensiles", ustensils, "ustensil")
  ].join("");

  // Réactiver les listeners pour les nouveaux éléments
  initFilterListeners();

  // Mise à jour compteur
  const count = results.length;
  recipesCountEl.textContent = `${count} recette${count > 1 ? "s" : ""}`;

  // Aucune recette
  if (count === 0 && rawQuery.length > 0) {
    const suggestion =
      recipes.length > 0 ? recipes[0].name : "une autre recherche";
    cardsContainer.innerHTML = `
      <div class="col-span-full flex justify-center py-8">
        <p class="text-red-600 text-2xl font-semibold text-center">
          Aucune recette ne contient « ${rawQuery} » – essayez par exemple : « ${suggestion} »
        </p>
      </div>
    `;
  } else {
    renderRecipes(results, cardsContainer);
  }

  renderSelectedTags(selectedTagsContainer, selectedTags);
}

function initFilterListeners() {
  // 1) Recherche live dans chaque dropdown, avec remise à 5 max si vide
  filtersContainer.addEventListener("input", (e) => {
    if (!e.target.matches("[data-filter-input]")) return;
    const q = e.target.value.trim().toLowerCase();
    const details = e.target.closest("details");
    if (!details) return;
    const list = details.querySelector("[data-filter-list]");
    if (!list) return;

    const lis = Array.from(list.querySelectorAll("li[data-tag]"));
    const MAX_VISIBLE = 5;

    if (q === "") {
      lis.forEach((li, idx) => {
        li.classList.toggle("hidden", idx >= MAX_VISIBLE);
      });
      return;
    }

    lis.forEach((li) => {
      const match = li.textContent.toLowerCase().includes(q);
      li.classList.toggle("hidden", !match);
    });
  });

  // 2) Sélection d’un tag ET fermeture du dropdown
  filtersContainer.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-tag]");
    if (!li) return;

    // 2.a récupération et fermeture du <details> parent
    const details = li.closest("details");
    if (details) details.open = false;

    // 2.b sélection du tag
    const {type, tag} = li.dataset;
    if (!selectedTags[type].includes(tag)) {
      selectedTags[type].push(tag);
      updateResults();
    }
  });

  // 3) Suppression d’un badge
  selectedTagsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-badge]");
    if (!btn) return;
    const {type, tag} = btn.dataset;
    selectedTags[type] = selectedTags[type].filter((t) => t !== tag);
    updateResults();
  });
}

// 1 fetch unique pour tout
fetch("/src/js/data/recipes.json")
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then((data) => {
    recipes = data;

    // injecte les dropdowns
    filtersContainer.innerHTML = [
      createTagDropdown(
        "Ingrédients",
        getUniqueIngredients(data),
        "ingredient"
      ),
      createTagDropdown("Appareils", getUniqueAppliances(data), "appliance"),
      createTagDropdown("Ustensiles", getUniqueUstensils(data), "ustensil")
    ].join("");

    // monte les écouteurs
    initFilterListeners();

    // recherche interne dans les dropdowns
    document.querySelectorAll("[data-filter-input]").forEach((input) => {
      input.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const details = e.target.closest("details");
        if (!details) return;
        const list = details.querySelector("[data-filter-list]");
        if (!list) return;
        list.querySelectorAll("li[data-tag]").forEach((li) => {
          li.classList.toggle(
            "hidden",
            !li.textContent.toLowerCase().includes(query)
          );
        });
      });
    });

    // Affiche tout et initialise le compteur au chargement
    updateResults();
  })
  .catch((err) => {
    console.error("Échec du chargement :", err);
    cardsContainer.innerHTML = `<p class="text-red-600">Erreur de chargement des recettes.</p>`;
  });

// recherche texte principale
searchInput.addEventListener("input", updateResults);

// prise en charge du bouton reset du form
const searchForm = searchInput.closest("form");
if (searchForm) {
  searchForm.addEventListener("reset", () => {
    setTimeout(updateResults, 0);
  });

  // ferme tout dropdown <details> si on clique en dehors
  document.addEventListener("click", (e) => {
    // si le clic ne se produit pas dans un <details> ni sur un <summary>
    if (!e.target.closest("details")) {
      document
        .querySelectorAll("details[open]")
        .forEach((d) => (d.open = false));
    }
  });
}
