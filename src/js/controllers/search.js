// search.js

import {normalize} from "../utils/normalization.js";
import {getUniqueIngredients, getUniqueAppliances, getUniqueUstensils} from "../utils/tagUtils.js";
import {createTagDropdown} from "../components/tagDropdown.js";
import {filterByTags} from "../services/tagFilter.js";
import {renderRecipes, renderSelectedTags} from "./uiController.js";

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
  const q = normalize(rawQuery);

  // On filtre les recettes par nom et description
  const textFiltered = q.length >= 3 ? recipes.filter((r) => (normalize(r.name) + " " + normalize(r.description)).includes(q)) : [...recipes]; // Si la recherche est inférieure à 3 caractères, on affiche toutes les recettes

  const tagFiltered = Object.entries(selectedTags).reduce(
    // On filtre les recettes par tags
    (acc, [type, tags]) => (tags.length ? filterByTags(acc, tags, type) : acc), // si la liste tags n’est pas vide, on appelle filterByTags(acc, tags, type), sinon on passe simplement l’accumulateur tel quel
    textFiltered //  liste des recettes filtrées à la fois par texte et par tags
  );

  const ingredients = getUniqueIngredients(tagFiltered).filter(
    // Extrait l’ensemble des tags disponibles dans le résultat
    (i) => !selectedTags.ingredient.includes(i) //puis on enlève ceux déjà sélectionné pour ne pas les proposer à nouveau dans le dropdown
  );
  const appliances = getUniqueAppliances(tagFiltered).filter((a) => !selectedTags.appliance.includes(a));
  const ustensils = getUniqueUstensils(tagFiltered).filter((u) => !selectedTags.ustensil.includes(u));

  filtersContainer.innerHTML = [
    createTagDropdown("Ingrédients", ingredients, "ingredient"),
    createTagDropdown("Appareils", appliances, "appliance"),
    createTagDropdown("Ustensiles", ustensils, "ustensil")
  ].join("");

  initFilterListeners();

  const count = tagFiltered.length;
  recipesCountEl.textContent = `${count} recette${count > 1 ? "s" : ""}`; //Mise à jour du compteur

  if (count === 0 && rawQuery.length > 0) {
    // Si aucune recette ne correspond à la recherche
    const suggestion = recipes.length > 0 ? recipes[0].name : "une autre recherche";
    cardsContainer.innerHTML = `
      <div class="col-span-full flex justify-center py-8">
        <p class="text-red-600 text-2xl font-semibold text-center">
          Aucune recette ne contient « ${rawQuery} » – essayez par exemple : « ${suggestion} »
        </p>
      </div>
    `;
  } else {
    renderRecipes(tagFiltered, cardsContainer);
  }

  renderSelectedTags(selectedTagsContainer, selectedTags); // Affichage des tags sélectionnés
}
