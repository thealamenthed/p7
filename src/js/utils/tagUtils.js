// utils/tagUtils.js
// fonctions pures qui extraient et renvoient les tableaux complets (tous les ingrédients, appareils ou ustensiles)
export function getUniqueIngredients(recipes) {
  const set = new Set();
  recipes.forEach((r) =>
    r.ingredients.forEach(({ingredient}) => set.add(ingredient.toLowerCase()))
  );
  return Array.from(set).sort();
}

export function getUniqueAppliances(recipes) {
  const set = new Set(recipes.map((r) => r.appliance.toLowerCase()));
  return Array.from(set).sort();
}

export function getUniqueUstensils(recipes) {
  const set = new Set();
  recipes.forEach((r) => r.ustensils.forEach((u) => set.add(u.toLowerCase())));
  return Array.from(set).sort();
}
