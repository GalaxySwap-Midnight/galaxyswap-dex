export interface Token {
  symbol: string;
  name: string;
  type: string;
  address: string;
}

export const popularTokens: Token[] = [
  {
    symbol: 'TA',
    name: 'Test A',
    type: '02000083ebc824e4f7aa34a10bc8132c57e10edeffbf982100affa5e3f0e394632c4',
    address:
      '0200d4b9a49d299004c58fc3a9b98a3582cb863ded1eed67a26d9a420be0d106a0ab',
  },
  {
    symbol: 'TB',
    name: 'Test B',
    type: '0200ece07b651d2806ffc57a3130fb29778dfe731ac1e2d1657cc646bea3ecf4d8bc',
    address:
      '02007c516935a083b8a6f895a5a3ddacba36b7722eff5f68fcd15f0c9adc8b9c61f9',
  },
  {
    symbol: 'TUSD',
    name: 'Test USD',
    type: '020044c5e6f0e5e31c4db5ae99e28bb2d9bfe5416fc81a07c6f182188d74bd1968ac',
    address:
      '02003a6c827a7373c2accc93b25674f8438c102f898aaf41297363ca7b07ade914ee',
  },
  {
    symbol: 'TEURO',
    name: 'Test Euro',
    type: '020093d51b1346b4e1971307a47b061667a689e763aea258ccb239f9e2507ad1d2df',
    address:
      '02005b4fe8c79a87daeb4c3dde0e10d7be9e28c564375489c9a95f029018751f861e',
  },
  {
    symbol: 'TJPY',
    name: 'Test Japanese Yen',
    type: '',
    address: '',
  },
  {
    symbol: 'TCNY',
    name: 'Test Chinese Yuan',
    type: '',
    address: '',
  },
  {
    symbol: 'TARS',
    name: 'Test Argentine Peso',
    type: '',
    address: '',
  },
];

/**
 * Get a token by its name
 */
export function getTokenByName(name: string): Token | undefined {
  return popularTokens.find((token) => token.name === name);
}

/**
 * Get a token by its symbol
 */
export function getTokenBySymbol(symbol: string): Token | undefined {
  return popularTokens.find((token) => token.symbol === symbol);
}

/**
 * Get a token by its address
 */
export function getTokenByAddress(address: string): Token | undefined {
  return popularTokens.find((token) => token.address === address);
}

/**
 * Get a token by its type
 */
export function getTokenByType(type: string): Token | undefined {
  return popularTokens.find((token) => token.type === type);
}

/**
 * Get all token symbols
 */
export function getAllTokenSymbols(): string[] {
  return popularTokens.map((token) => token.symbol);
}

/**
 * Get all token addresses
 */
export function getAllTokenAddresses(): string[] {
  return popularTokens.map((token) => token.address);
}

/**
 * Get all token types
 */
export function getAllTokenTypes(): string[] {
  return popularTokens.map((token) => token.type);
}
