// Small helpers to ensure we never leak internal IDs in WhatsApp messages

/**
 * Remove any "Product ID: <something>" fragments from text, regardless of case.
 * Also trims redundant separators that may be left behind.
 */
export function sanitizeWhatsAppText(text = '') {
  try {
    const noId = text.replace(/\s*-?\s*product\s*id:\s*[^\s]+/gi, '').trim();
    // Clean up leftover multiple spaces and duplicate separators like ' -  - '
    return noId
      .replace(/\s{2,}/g, ' ')
      .replace(/\s*-\s*-\s*/g, ' - ')
      .replace(/\s*-\s*$/g, '')
      .replace(/^\s*-\s*/g, '')
      .trim();
  } catch {
    return text;
  }
}

/**
 * Open WhatsApp with a sanitized, encoded message.
 * If phone is falsy, it falls back to web whatsapp with just the text.
 */
export function openWhatsAppWithMessage({ phone, message }) {
  const sanitized = sanitizeWhatsAppText(message);
  const encoded = encodeURIComponent(sanitized);
  const target = phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://web.whatsapp.com/send?text=${encoded}`;
  if (typeof window !== 'undefined') {
    window.open(target, '_blank', 'noopener,noreferrer');
  }
}
