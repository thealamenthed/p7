// controllers/searchWithLoops.js

import {normalize} from "../utils/normalization.js";
import {
  getUniqueIngredients,
  getUniqueAppliances,
  getUniqueUstensils
} from "../utils/tagUtils.js";
import {createTagDropdown} from "../components/tagDropdown.js";
import {filterByTagsWithLoops} from "../services/tagFilter.js";
import {renderRecipes, renderSelectedTags} from "./uiController.js";

export function filterRecipesByQuery(query, list) {
  const q = normalize(query);
  const filtered = [];

  if (q.length >= 3) {
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      const fullText = normalize(r.name) + " " + normalize(r.description);
      if (fullText.includes(q)) {
        filtered.push(r);
      }
    }
  } else {
    for (let i = 0; i < list.length; i++) {
      filtered.push(list[i]);
    }
  }

  return filtered;
}

export function applySelectedTags(recipes, selectedTags) {
  let filtered = recipes;
  for (const type in selectedTags) {
    const tags = selectedTags[type];
    if (tags.length > 0) {
      filtered = filterByTagsWithLoops(filtered, tags, type);
    }
  }
  return filtered;
}

export function removeSelectedTags(list, selected, out = []) {
  for (let i = 0; i < list.length; i++) {
    const tag = list[i];
    let keep = true;
    for (let j = 0; j < selected.length; j++) {
      if (tag === selected[j]) {
        keep = false;
        break;
      }
    }
    if (keep) out.push(tag);
  }
  return out;
}

export function updateResults({
  searchInput,
  recipes,
  selectedTags,
  filtersContainer,
  initFilterListeners,
  cardsContainer,
  recipesCountEl,
  selectedTagsContainer
}) {
  const rawQuery = searchInput.value.trim();
  let results = filterRecipesByQuery(rawQuery, recipes);
  results = applySelectedTags(results, selectedTags);

  const ingredientsAll = getUniqueIngredients(results);
  const appliancesAll = getUniqueAppliances(results);
  const ustensilsAll = getUniqueUstensils(results);

  const ingredients = removeSelectedTags(
    ingredientsAll,
    selectedTags.ingredient
  );
  const appliances = removeSelectedTags(appliancesAll, selectedTags.appliance);
  const ustensils = removeSelectedTags(ustensilsAll, selectedTags.ustensil);

  filtersContainer.innerHTML = [
    createTagDropdown("Ingrédients", ingredients, "ingredient"),
    createTagDropdown("Appareils", appliances, "appliance"),
    createTagDropdown("Ustensiles", ustensils, "ustensil")
  ].join("");

  initFilterListeners();

  const count = results.length;
  recipesCountEl.textContent = `${count} recette${count > 1 ? "s" : ""}`;

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
