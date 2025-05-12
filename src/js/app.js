// src/js/app.js

import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils
} from "./utils/tagUtils.js";
import {createTagDropdown} from "./components/tagDropdown.js";
import {updateResults} from "./controllers/searchWithArrayMethods.js";

const cardsContainer = document.querySelector("[data-recipes-list]");
const searchInput = document.querySelector("[data-recipes-search]");
const filtersContainer = document.querySelector("[data-filters]");
const selectedTagsContainer = document.querySelector("[data-selected-tags]");
const recipesCountEl = document.querySelector("[data-recipes-count]");

let recipes = [];
const selectedTags = {ingredient: [], appliance: [], ustensil: []};

function initFilterListeners() {
  // 1) Recherche live dans chaque dropdown
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

  // 2) Sélection d’un tag
  filtersContainer.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-tag]");
    if (!li) return;

    const details = li.closest("details");
    if (details) details.open = false;

    const {type, tag} = li.dataset;
    if (!selectedTags[type].includes(tag)) {
      selectedTags[type].push(tag);
      updateResults({
        searchInput,
        recipes,
        selectedTags,
        filtersContainer,
        initFilterListeners,
        cardsContainer,
        recipesCountEl,
        selectedTagsContainer
      });
    }
  });

  // 3) Suppression d’un badge
  selectedTagsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-badge]");
    if (!btn) return;
    const {type, tag} = btn.dataset;
    selectedTags[type] = selectedTags[type].filter((t) => t !== tag);
    updateResults({
      searchInput,
      recipes,
      selectedTags,
      filtersContainer,
      initFilterListeners,
      cardsContainer,
      recipesCountEl,
      selectedTagsContainer
    });
  });
}

// Chargement des données JSON
fetch("/src/js/data/recipes.json")
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then((data) => {
    recipes = data;

    filtersContainer.innerHTML = [
      createTagDropdown(
        "Ingrédients",
        getUniqueIngredients(data),
        "ingredient"
      ),
      createTagDropdown("Appareils", getUniqueAppliances(data), "appliance"),
      createTagDropdown("Ustensiles", getUniqueUstensils(data), "ustensil")
    ].join("");

    initFilterListeners();

    updateResults({
      searchInput,
      recipes,
      selectedTags,
      filtersContainer,
      initFilterListeners,
      cardsContainer,
      recipesCountEl,
      selectedTagsContainer
    });
  })
  .catch((err) => {
    console.error("Échec du chargement :", err);
    cardsContainer.innerHTML = `<p class="text-red-600">Erreur de chargement des recettes.</p>`;
  });

// Recherche principale
searchInput.addEventListener("input", () => {
  updateResults({
    searchInput,
    recipes,
    selectedTags,
    filtersContainer,
    initFilterListeners,
    cardsContainer,
    recipesCountEl,
    selectedTagsContainer
  });
});

// Reset du formulaire de recherche
const searchForm = searchInput.closest("form");
if (searchForm) {
  searchForm.addEventListener("reset", () => {
    setTimeout(() => {
      updateResults({
        searchInput,
        recipes,
        selectedTags,
        filtersContainer,
        initFilterListeners,
        cardsContainer,
        recipesCountEl,
        selectedTagsContainer
      });
    }, 0);
  });

  // Fermeture des dropdowns quand on clique en dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest("details")) {
      document
        .querySelectorAll("details[open]")
        .forEach((d) => (d.open = false));
    }
  });
}
