export function normalize(str) {
  const trimmed = str.trim();
  const lower = trimmed.toLowerCase();
  const withoutAccents = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Décompose chaque caractère accentué en caractère de base + diacritiques (accents) supprime ensuite tous ces « marqueurs » d’accent issus de la plage Unicode U+0300 à U+036F
  return withoutAccents
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
