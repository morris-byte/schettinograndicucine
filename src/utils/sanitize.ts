/**
 * Sanitizes user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export const sanitizeHtml = (input: string | null | undefined): string => {
  if (!input) return '';
  
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes text for use in HTML attributes
 */
export const sanitizeAttribute = (input: string | null | undefined): string => {
  return sanitizeHtml(input);
};

/**
 * Truncates string to max length to prevent extremely long inputs
 */
export const truncate = (input: string, maxLength: number = 500): string => {
  if (!input) return '';
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength) + '...';
};
