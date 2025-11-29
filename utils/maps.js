// Helpers to construct a clean Google Maps URL that opens the place page

const COORDS_REGEX = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/;

export function buildGoogleMapsUrl(input, fallbackAddress = '') {
  if (!input && !fallbackAddress) return null;
  const raw = String(input || fallbackAddress).trim();
  if (!raw) return null;

  // If a full URL is provided, open it directly (avoid wrapping it into a search link)
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  // If a Place ID is provided
  if (/^place_id:/i.test(raw)) {
    return `https://www.google.com/maps/place/?q=${encodeURIComponent(raw)}`;
  }

  // If it's coordinates like "21.60, 71.21"
  if (COORDS_REGEX.test(raw)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(raw)}`;
  }

  // Fallback to place-style URL which tends to open the detail pane rather than a result list
  return `https://www.google.com/maps/place/${encodeURIComponent(raw)}`;
}

export default { buildGoogleMapsUrl };
