/**
 * Environment variables validation and configuration
 * Validates all required environment variables at startup
 */

const requiredEnvVars = {
  VITE_RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
} as const;

const optionalEnvVars = {
  VITE_MAKE_WEBHOOK_URL: import.meta.env.VITE_MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/dbeari9w8c7p9ft1dhizsuvrd2a98gqi',
  VITE_SUPABASE_FUNCTION_URL: import.meta.env.VITE_SUPABASE_FUNCTION_URL || 'https://laxbglhrrcbrxpnpvcob.supabase.co/functions/v1/send-test-email',
  VITE_GTM_CONTAINER_ID: import.meta.env.VITE_GTM_CONTAINER_ID || '',
} as const;

/**
 * Validates that all required environment variables are set
 * Throws an error with a helpful message if any are missing
 */
export const validateEnv = () => {
  const missing: string[] = [];
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }
};

/**
 * Get Make webhook URL from environment
 */
export const getMakeWebhookUrl = (): string => {
  return optionalEnvVars.VITE_MAKE_WEBHOOK_URL;
};

/**
 * Get Supabase function URL from environment
 */
export const getSupabaseFunctionUrl = (): string => {
  return optionalEnvVars.VITE_SUPABASE_FUNCTION_URL;
};

/**
 * Get GTM container ID from environment
 */
export const getGTMContainerId = (): string => {
  return optionalEnvVars.VITE_GTM_CONTAINER_ID;
};

// Validate on module load (only in browser, not during build)
if (typeof window !== 'undefined') {
  try {
    validateEnv();
  } catch (error) {
    // Log error but don't crash - show warning instead
    // TODO: Configurare variabili d'ambiente su Vercel
    console.warn('⚠️ Environment validation warning:', error);
    console.warn('⚠️ L\'app continuerà a funzionare con valori di fallback');
    console.warn('⚠️ Configura le variabili d\'ambiente su Vercel per sicurezza ottimale');
    // Non crashare in produzione - permettere all'app di funzionare
  }
}
