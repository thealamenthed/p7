// src/services/tagFilter.js
/**
 * Filtre les recettes pour ne garder que celles contenant
 * **tous** les tags du type donné.
 * @param {Object[]} recipes
 * @param {string[]} tags
 * @param {'ingredient'|'appliance'|'ustensil'} type
 */
export function filterByTagsWithLoops(recipes, tags, type) {
  const filtered = [];

  for (let i = 0; i < recipes.length; i++) {
    const r = recipes[i];
    let pool = [];

    if (type === "ingredient") {
      for (let j = 0; j < r.ingredients.length; j++) {
        pool.push(r.ingredients[j].ingredient.toLowerCase());
      }
    } else if (type === "appliance") {
      pool.push(r.appliance.toLowerCase());
    } else if (type === "ustensil") {
      for (let j = 0; j < r.ustensils.length; j++) {
        pool.push(r.ustensils[j].toLowerCase());
      }
    }

    let hasAllTags = true;
    for (let j = 0; j < tags.length; j++) {
      if (!pool.includes(tags[j])) {
        hasAllTags = false;
        break;
      }
    }

    if (hasAllTags) {
      filtered.push(r);
    }
  }

  return filtered;
}
