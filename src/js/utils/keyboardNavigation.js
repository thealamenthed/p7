/**
 * Active la navigation clavier pour les dropdowns de filtres (tags)
 * - Flèches haut/bas pour naviguer
 * - Entrée pour sélectionner
 * - Tab + Entrée fonctionne aussi
 * - Échap ferme le menu
 *
 * @param {HTMLElement} filtersContainer - Le conteneur des filtres
 */
export function enableDropdownKeyboardNavigation(filtersContainer) {
  filtersContainer.addEventListener("keydown", (e) => {
    const input = e.target.closest("[data-filter-input]");
    const li = e.target.closest("li[data-tag]");
    const details = e.target.closest("details");

    // Gestion flèches dans input de recherche
    if (input && details) {
      const list = details.querySelector("[data-filter-list]");
      if (!list) return;

      const items = Array.from(
        list.querySelectorAll("li[data-tag]:not(.hidden)")
      );
      if (items.length === 0) return;

      let currentIndex = items.findIndex((el) =>
        el.classList.contains("highlighted")
      );

      // Supprime tous les highlights
      items.forEach((el) => el.classList.remove("highlighted"));

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].classList.add("highlighted");
        items[currentIndex].scrollIntoView({block: "nearest"});
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        items[currentIndex].classList.add("highlighted");
        items[currentIndex].scrollIntoView({block: "nearest"});
      }

      if (e.key === "Enter" && currentIndex >= 0) {
        e.preventDefault();
        items[currentIndex].click();
        input.focus();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        details.open = false;
        input.focus();
      }
    }

    // Activation avec Tab + Entrée sur li
    if (li && e.key === "Enter") {
      e.preventDefault();
      li.click();
      const inputInside = details?.querySelector("[data-filter-input]");
      if (inputInside) inputInside.focus();
    }

    // Escape sur li (fermer dropdown)
    if (li && e.key === "Escape") {
      e.preventDefault();
      if (details) details.open = false;
    }
  });
}
