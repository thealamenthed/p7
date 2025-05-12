import RecipeCard from "../components/RecipeCard.js";
import {createTagBadge} from "../components/tagBadge.js";
import {normalize} from "../utils/normalization.js";
import {filterByTags} from "../services/tagFilter.js";

const cardsContainer = document.querySelector("[data-recipes-list]");

const searchInput = document.querySelector("[data-recipes-search]");
const filtersContainer = document.querySelector("[data-filters]");
const selectedTagsContainer = document.querySelector("[data-selected-tags]");

let recipes = [],
  selectedTags = {ingredient: [], appliance: [], ustensil: []};

// Met à jour résultats texte + tags
function updateResults() {
  const q = normalize(searchInput.value);
  // recherche texte
  let results =
    q.length >= 3
      ? recipes.filter((r) =>
          (normalize(r.name) + " " + normalize(r.description)).includes(q)
        )
      : [...recipes];

  // filtre par tags
  for (const [type, tags] of Object.entries(selectedTags)) {
    if (tags.length) {
      results = filterByTags(results, tags, type);
    }
  }

  renderRecipes(results);
  renderSelectedTags();
}

// Au clic sur un badge, on le retire
selectedTagsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-badge]");
  if (!btn) return;
  const {type, tag} = btn.dataset;
  // on enlève de l'état
  selectedTags[type] = selectedTags[type].filter((t) => t !== tag);
  updateResults();
});

// Au clic sur un <li> du dropdown, on ajoute le tag
filtersContainer.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-tag]");
  if (!li) return;
  const {type, tag} = li.dataset;
  if (!selectedTags[type].includes(tag)) {
    selectedTags[type].push(tag);
    updateResults();
  }
});

// Recherche texte
searchInput.addEventListener("input", updateResults);

// Initialisation après fetch
export function initSearch(data) {
  recipes = data;
  renderRecipes(recipes);
  // les dropdowns doivent déjà être injectés avant ça
}
