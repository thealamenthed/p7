import RecipeCard from "../components/RecipeCard.js";
import {createTagBadge} from "../components/tagBadge.js";

export function renderRecipes(list, container) {
  container.innerHTML = "";
  list.forEach((r) => container.insertAdjacentHTML("beforeend", RecipeCard(r)));
}

export function renderSelectedTags(container, selectedTags) {
  container.innerHTML = "";
  Object.entries(selectedTags).forEach(([type, tags]) => {
    tags.forEach((tag) =>
      container.insertAdjacentHTML("beforeend", createTagBadge(tag, type))
    );
  });
}
