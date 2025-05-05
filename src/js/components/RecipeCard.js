/**
 * Creates a recipe card.
 * @param {Object} recipe - The recipe data.
 * @returns {string} The HTML string of the recipe card.
 */
const RecipeCard = (recipe) => {
  const {id, name, description, image, time, ingredients} = recipe;

  // Return the recipe card
  return `
        <article class="relative overflow-hidden bg-white shadow-lg rounded-xl">
          <!-- Badge Durée -->
          <span
            class="absolute self-end inline-block px-2 py-1 text-sm bg-yellow-400 rounded-full top-6 right-5 text-neutral-900">
            ${time}min
          </span>
          <img
            src="/public/img/${image}"
            alt="${name}"
            class="object-cover w-full h-72" />

          <!-- Contenu de la carte -->
          <div class="flex flex-col gap-4 p-4 mb-4">
            <h3 class="text-lg font-bold font-anton">${name}</h3>

            <p class="text-xs font-semibold tracking-wider text-gray-400">
              RECETTE
            </p>
            <p class="text-sm leading-relaxed text-gray-700 line-clamp-4">
            ${description}
            </p>

            <div class="mt-5">
              <p class="text-xs font-semibold tracking-wider text-gray-400">
                INGREDIENTS
              </p>
            </div>
            <ul
              class="grid grid-cols-2 gap-4 space-y-1 text-sm text-gray-600 list-none">
              ${createIngredientList(ingredients)}
            </ul>
          </div>
        </article>
  `;
};

/**
 * Creates a list of ingredients.
 * @param {Array} ingredients - The ingredients to include in the list.
 * @returns {string} The HTML string of the ingredient list.
 */
const createIngredientList = (ingredients) => {
  return ingredients
    .map(
      ({ingredient, quantity, unit}) => `
        <li class="flex flex-col">
          <strong>${ingredient}</strong>
          <span class="font-normal text-gray-400">${quantity || ""} ${
        unit || ""
      }</span>
        </li>
      `
    )
    .join("");
};

export default RecipeCard;
