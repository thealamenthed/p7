// src/js/app.js

import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils
} from "./utils/tagUtils.js";
import {createTagDropdown} from "./components/tagDropdown.js";
import {updateResults} from "./controllers/searchWithArrayMethods.js";
import {enableDropdownKeyboardNavigation} from "./utils/keyboardNavigation.js";

const cardsContainer = document.querySelector("[data-recipes-list]");
const searchInput = document.querySelector("[data-recipes-search]");
const filtersContainer = document.querySelector("[data-filters]");
const selectedTagsContainer = document.querySelector("[data-selected-tags]");
const recipesCountEl = document.querySelector("[data-recipes-count]");

let recipes = [];
const selectedTags = {ingredient: [], appliance: [], ustensil: []};

const getUpdateParams = () => ({
  searchInput,
  recipes,
  selectedTags,
  filtersContainer,
  initFilterListeners,
  cardsContainer,
  recipesCountEl,
  selectedTagsContainer
});

// Charge les données de recettes depuis le fichier JSON
function loadRecipes() {
  fetch("/src/js/data/recipes.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.status); // gestion des erreurs HTTP
      return r.json();
    })
    .then((data) => {
      recipes = data;
      renderDropdowns(data);
      initFilterListeners();
      updateResults(getUpdateParams());
    })
    .catch((err) => {
      console.error("Échec du chargement :", err);
      cardsContainer.innerHTML = `<p class="text-red-600">Erreur de chargement des recettes.</p>`;
    });
}
// Génère les dropdowns de filtres dynamiquement à partir des données
function renderDropdowns(data) {
  filtersContainer.innerHTML = [
    createTagDropdown("Ingrédients", getUniqueIngredients(data), "ingredient"),
    createTagDropdown("Appareils", getUniqueAppliances(data), "appliance"),
    createTagDropdown("Ustensiles", getUniqueUstensils(data), "ustensil")
  ].join("");
}

// Configure les événements globaux (barre de recherche, reset formulaire, clic en dehors)
function setupGlobalEvents() {
  const searchForm = searchInput.closest("form");

  searchInput.addEventListener("input", () => {
    updateResults(getUpdateParams());
  });

  if (searchForm) {
    searchForm.addEventListener("reset", () => {
      setTimeout(() => updateResults(getUpdateParams()), 0);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("details")) {
        document
          .querySelectorAll("details[open]")
          .forEach((d) => (d.open = false));
      }
    });
  }
}

// Initialise les événements liés aux filtres (dropdowns)
function initFilterListeners() {
  enableDropdownKeyboardNavigation(filtersContainer);

  filtersContainer.addEventListener("input", handleDropdownSearch); // Recherche interne dans un dropdown
  filtersContainer.addEventListener("click", handleTagSelection); // Clic sur un tag dans un dropdown
  selectedTagsContainer.addEventListener("click", handleBadgeRemoval); // Clic sur un badge pour supprimer un tag sélectionné
}

// Recherche dans un dropdown (filtrage local des items)
function handleDropdownSearch(e) {
  if (!e.target.matches("[data-filter-input]")) return;
  const q = e.target.value.trim().toLowerCase();
  const details = e.target.closest("details");
  const list = details?.querySelector("[data-filter-list]");
  const lis = list ? Array.from(list.querySelectorAll("li[data-tag]")) : [];

  const MAX_VISIBLE = 5;

  lis.forEach((li, idx) => {
    const match = li.textContent.toLowerCase().includes(q);
    li.classList.toggle("hidden", q ? !match : idx >= MAX_VISIBLE);
  });
}

// Gère la sélection d’un tag dans un dropdown
function handleTagSelection(e) {
  const li = e.target.closest("li[data-tag]");
  if (!li) return;

  const {type, tag} = li.dataset;
  if (!selectedTags[type].includes(tag)) {
    selectedTags[type].push(tag);
    const details = li.closest("details");
    if (details) details.open = false;
    updateResults(getUpdateParams());
  }
}

// Supprime un tag (badge) sélectionné
function handleBadgeRemoval(e) {
  const btn = e.target.closest("button[data-badge]");
  if (!btn) return;
  const {type, tag} = btn.dataset;
  selectedTags[type] = selectedTags[type].filter((t) => t !== tag);
  updateResults(getUpdateParams());
}

// === Initialisation ===
setupGlobalEvents();
loadRecipes();
