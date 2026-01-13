// Logger utility - sempre logga per debug (anche in produzione per ora)
// TODO: Rimuovere in produzione quando tutto funziona
const isDev = import.meta.env.DEV;
const FORCE_LOGGING = true; // Forza logging anche in produzione per debug

export const logger = {
  log: (...args: unknown[]) => {
    // Logga sempre per debug (anche in produzione)
    if (isDev || FORCE_LOGGING) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    // Logga sempre i warning (anche in produzione)
    if (isDev || FORCE_LOGGING) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  info: (...args: unknown[]) => {
    // Logga sempre per debug (anche in produzione)
    if (isDev || FORCE_LOGGING) {
      console.info(...args);
    }
  },
};

