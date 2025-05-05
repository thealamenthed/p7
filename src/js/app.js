// Data import
import RecipeCard from "/src/js/components/RecipeCard.js";
import {normalize} from "/src/js/utils/normalization.js";

const cardsContainer = document.querySelector(".grid.grid-cols-1.gap-8");
const searchInput = document.querySelector("[data-recipes-search]");

let recipes = []; // contiendra le tableau de recettes

// Affiche une liste de recettes dans le DOM
function renderRecipes(list) {
  cardsContainer.innerHTML = "";
  list.forEach((recipe) => {
    cardsContainer.insertAdjacentHTML("beforeend", RecipeCard(recipe));
  });
}

// 1. Fetch le JSON
fetch("/src/js/data/recipes.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    recipes = data;
    renderRecipes(recipes); // affichage initial
  })
  .catch((err) => {
    console.error("Impossible de charger recipes.json :", err);
    cardsContainer.innerHTML = `
      <p class="text-red-600">
        Erreur de chargement des recettes.
      </p>
    `;
  });

// 2. Recherche dynamique
searchInput.addEventListener("input", (e) => {
  const q = normalize(e.target.value);

  if (q.length >= 3) {
    const filtered = recipes.filter((r) => {
      const haystack = normalize(r.name) + " " + normalize(r.description);
      return haystack.includes(q);
    });
    renderRecipes(filtered);
  } else if (q.length === 0) {
    renderRecipes(recipes);
  }
});
