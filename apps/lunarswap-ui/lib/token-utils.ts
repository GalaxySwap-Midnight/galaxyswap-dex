import { popularTokens } from './token-config';

// Generate a consistent color based on token symbol
export function getTokenColor(symbol: string): string {
  // Use a hash function to generate consistent colors
  const hash = symbol.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate hue from hash (0-360)
  const hue = Math.abs(hash) % 360;
  
  // Use different saturation and lightness for different token types
  let saturation = 70;
  let lightness = 50;
  
  // Adjust based on token type
  if (symbol.startsWith('T')) {
    // Test tokens - more vibrant
    saturation = 80;
    lightness = 45;
  } else if (symbol === 'LUNAR') {
    // LUNAR token - golden
    return 'bg-yellow-500';
  }
  
  // Convert HSL to a Tailwind-like color class
  // For simplicity, we'll use a predefined set of colors
  const colorMap: Record<string, string> = {
    'TUSD': 'bg-blue-500',
    'TEURO': 'bg-green-500', 
    'TJPY': 'bg-red-500',
    'TCNY': 'bg-orange-500',
    'TARS': 'bg-purple-500',
    'LUNAR': 'bg-yellow-500',
    'TGBP': 'bg-indigo-500',
  };
  
  return colorMap[symbol] || `bg-gray-${Math.abs(hash % 5) + 4}00`;
}

// Get token details from DEMO_TOKENS
export function getTokenDetails(symbol: string) {
  return Object.values(popularTokens).find(token => token.symbol === symbol);
}

// Get all available token symbols
export function getAvailableTokenSymbols(): string[] {
  return Object.values(popularTokens).map(token => token.symbol);
} 