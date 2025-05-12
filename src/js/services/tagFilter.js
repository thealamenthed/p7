// src/services/tagFilter.js
/**
 * Filtre les recettes pour ne garder que celles contenant
 * **tous** les tags du type donné.
 * @param {Object[]} recipes
 * @param {string[]} tags
 * @param {'ingredient'|'appliance'|'ustensil'} type
 */
export function filterByTags(recipes, tags, type) {
  return recipes.filter((r) => {
    let pool = [];
    if (type === "ingredient")
      pool = r.ingredients.map((i) => i.ingredient.toLowerCase());
    if (type === "appliance") pool = [r.appliance.toLowerCase()];
    if (type === "ustensil") pool = r.ustensils.map((u) => u.toLowerCase());
    return tags.every((t) => pool.includes(t));
  });
}
