// src/js/app.js

import RecipeCard from "./components/RecipeCard.js";
import {normalize} from "./utils/normalization.js";
import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils
} from "./utils/tagUtils.js";
import {createTagDropdown} from "./components/tagDropdown.js";
import {createTagBadge} from "./components/tagBadge.js";
import {filterByTags} from "./services/tagFilter.js";

const cardsContainer = document.querySelector(".grid.grid-cols-1.gap-8");
const searchInput = document.querySelector("[data-recipes-search]");
const filtersContainer = document.querySelector("[data-filters]");
const selectedTagsContainer = document.querySelector("[data-selected-tags]");

let recipes = [];
const selectedTags = {ingredient: [], appliance: [], ustensil: []};

function renderRecipes(list) {
  cardsContainer.innerHTML = "";
  list.forEach((r) =>
    cardsContainer.insertAdjacentHTML("beforeend", RecipeCard(r))
  );
}

function renderSelectedTags() {
  selectedTagsContainer.innerHTML = "";
  Object.entries(selectedTags).forEach(([type, tags]) => {
    tags.forEach((tag) =>
      selectedTagsContainer.insertAdjacentHTML(
        "beforeend",
        createTagBadge(tag, type)
      )
    );
  });
}

function updateResults() {
  const q = normalize(searchInput.value);
  let results =
    q.length >= 3
      ? recipes.filter((r) =>
          (normalize(r.name) + " " + normalize(r.description)).includes(q)
        )
      : [...recipes];

  // applique tous les filtres tags
  Object.entries(selectedTags).forEach(([type, tags]) => {
    if (tags.length > 0) results = filterByTags(results, tags, type);
  });

  renderRecipes(results);
  renderSelectedTags();
}

function initFilterListeners() {
  // 1) filtrage texte dans chaque dropdown
  filtersContainer.addEventListener("input", (e) => {
    if (!e.target.matches("[data-filter-input]")) return;
    const q = e.target.value.toLowerCase();
    const ul = e.target.closest("div").querySelector("[data-filter-list]");
    ul.querySelectorAll("li[data-tag]").forEach((li) => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });

  // 2) toggle “Voir X de plus / Voir moins”
  filtersContainer.addEventListener("click", (e) => {
    const tog = e.target.closest("[data-toggle]");
    if (!tog) return;
    const ul = tog.closest("ul");
    const hiddenLis = ul.querySelectorAll("li.hidden");
    const showing = tog.textContent.includes("moins");
    hiddenLis.forEach((li) => li.classList.toggle("hidden", showing));
    tog.textContent = showing
      ? `Voir ${hiddenLis.length} de plus`
      : "Voir moins";
  });

  // 3) sélection d’un tag dans un dropdown
  filtersContainer.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-tag]");
    if (!li) return;
    const {type, tag} = li.dataset;
    if (!selectedTags[type].includes(tag)) {
      selectedTags[type].push(tag);
      updateResults();
    }
  });

  // 4) suppression d’un badge
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
    renderRecipes(recipes);
    // injecte les 3 dropdowns dynamiquement
    filtersContainer.innerHTML = [
      createTagDropdown(
        "Ingrédients",
        getUniqueIngredients(data),
        "ingredient"
      ),
      createTagDropdown("Appareils", getUniqueAppliances(data), "appliance"),
      createTagDropdown("Ustensiles", getUniqueUstensils(data), "ustensil")
    ].join("");
    initFilterListeners(); // monte tous les écouteurs
  })
  .catch((err) => {
    console.error("Échec du chargement :", err);
    cardsContainer.innerHTML = `<p class="text-red-600">Erreur de chargement des recettes.</p>`;
  });

// recherche texte
searchInput.addEventListener("input", updateResults);
