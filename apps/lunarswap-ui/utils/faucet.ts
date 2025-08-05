import { getFaucetUrl } from './config';

/**
 * Get the appropriate faucet URL based on environment
 * Uses proxy in development to avoid CORS issues
 */
export function getFaucetEndpoint(endpoint: string): string {
  const baseUrl = getFaucetUrl();

  // Check if we're in development by looking at the current hostname
  const isDevelopment =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port === '8080';

  // In development, use proxy to avoid CORS issues
  if (isDevelopment) {
    console.log(`[Faucet] Using proxy endpoint: /faucet${endpoint}`);
    return `/faucet${endpoint}`;
  }

  // In production, use direct URL
  console.log(`[Faucet] Using direct endpoint: ${baseUrl}${endpoint}`);
  return `${baseUrl}${endpoint}`;
}

/**
 * Check faucet health
 */
export async function checkFaucetHealth(): Promise<boolean> {
  try {
    const response = await fetch(getFaucetEndpoint('/health'));
    return response.ok;
  } catch (error) {
    console.error('Faucet health check failed:', error);
    return false;
  }
}

/**
 * Request tokens from faucet with captcha token
 */
export async function requestFaucetTokens(
  address: string,
  captchaToken: string,
): Promise<boolean> {
  const endpoints = ['/api/request-tokens', '/request', '/api/request'];

  for (const endpoint of endpoints) {
    try {
      console.log(`[Faucet] Trying endpoint: ${endpoint} with captcha token`);

      const response = await fetch(getFaucetEndpoint(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          captchaToken: captchaToken,
        }),
      });

      if (response.ok) {
        console.log(`[Faucet] Success with endpoint: ${endpoint}`);
        return true;
      }

      const errorData = await response.text();
      console.log(
        `[Faucet] Failed with endpoint: ${endpoint}, status: ${response.status}, error: ${errorData}`,
      );

      // If we get a 404, this endpoint doesn't exist, try the next one
      if (response.status === 404) {
        // Try next endpoint
      }
    } catch (error) {
      console.log(`[Faucet] Error with endpoint: ${endpoint}:`, error);
      // Try next endpoint
    }
  }

  throw new Error(
    'All faucet endpoints failed. Please check the faucet service status.',
  );
}
