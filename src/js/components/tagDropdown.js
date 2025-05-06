// components/tagDropdown.js

/**
 * @param {string} title      — Titre du dropdown ("Ingrédients", etc.)
 * @param {string[]} items    — Liste complète des tags (déjà triée)
 * @param {string} type       — “ingredient” | “appliance” | “ustensil”
 * @param {number} maxVisible — Nombre max d’éléments à afficher (5 par défaut)
 */
export function createTagDropdown(title, items, type, maxVisible = 5) {
  // découpage en deux tableaux
  const visibleItems = items.slice(0, maxVisible);

  // génération des <li>
  const lisVisible = visibleItems
    .map(
      (item) => `
    <li class="w-full px-4 py-2 cursor-pointer hover:bg-yellow-400"
        data-tag="${item}" data-type="${type}">
      ${item}
    </li>
  `
    )
    .join("");

  // assemblage du HTML du dropdown
  return `
    <div class="max-w-xs mx-auto my-4">
      <details class="relative bg-white rounded-lg shadow-xs group w-48">
        <summary class="flex items-center justify-between p-4 list-none cursor-pointer gap-x-14">
          <span class="capitalize">${title}</span>
          <svg class="w-4 h-4 transition-transform transform group-open:rotate-180"
               fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"/>
          </svg>
        </summary>
        <div class="absolute left-0 right-0 z-20 -mt-3 bg-white rounded-b-lg shadow-lg top-full">
          <div class="relative w-40 px-4 pt-3 mb-3">
            <svg class="absolute w-4 h-4 text-gray-400 left-[9.5rem] top-6"
                 fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              class="w-40 py-2 pl-2 pr-8 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              data-filter-input"
            />
          </div>
          <ul class="text-sm text-gray-700" data-filter-list>
            ${lisVisible}
    
          </ul>
        </div>
      </details>
    </div>
  `;
}
