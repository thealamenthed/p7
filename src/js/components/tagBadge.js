// src/components/tagBadge.js
/**
 * Génère le HTML d’un badge sélectionné.
 * @param {string} tag  – le texte du tag
 * @param {string} type – "ingredient" | "appliance" | "ustensil"
 * @returns {string}
 */
export function createTagBadge(tag, type) {
  return `
     <button
     type="button"
     class="inline-flex items-center justify-between p-4 mt-3 bg-yellow-400 rounded-lg shadow-xs min-w-52 gap-x-8 w-48"
     data-badge
     data-tag="${tag}"
     data-type="${type}">
     <span class="capitalize">${tag}</span>
      <svg
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
      d="M12 11.5L7 6.5M7 6.5L2 1.5M7 6.5L12 1.5M7 6.5L2 11.5"
      stroke="#1B1B1B"
      stroke-width="2.16667"
      stroke-linecap="round"
      stroke-linejoin="round" />
      </svg>
     </button>
  `;
}
