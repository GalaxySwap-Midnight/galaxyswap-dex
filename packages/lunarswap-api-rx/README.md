# Lunarswap API Rx

A reactive implementation of the Lunarswap API following the battleship API pattern. This package provides a reactive interface for interacting with Lunarswap contracts using RxJS observables.

## Features

- Reactive state management using RxJS
- Real-time contract state updates
- User action tracking
- Private state management
- Contract deployment and subscription
- Full Lunarswap functionality (add/remove liquidity, swaps, etc.)

## Installation

```bash
pnpm add @midnight-dapps/lunarswap-api-rx
```

## Usage

```typescript
import { LunarswapAPI } from '@midnight-dapps/lunarswap-api-rx';
import type { LunarswapProviders } from '@midnight-dapps/lunarswap-api-rx';

// Deploy a new Lunarswap contract
const lunarswap = await LunarswapAPI.deploy(
  'my-lunarswap-id',
  providers,
  logger
);

// Subscribe to state changes
lunarswap.state$.subscribe((state) => {
  console.log('Current state:', state);
});

// Add liquidity
await lunarswap.addLiquidity(
  tokenA,
  tokenB,
  amountAMin,
  amountBMin,
  to
);

// Swap tokens
await lunarswap.swapExactTokensForTokens(
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin,
  to
);
```

## API Reference

### LunarswapAPI

The main class for interacting with Lunarswap contracts.

#### Static Methods

- `deploy(lunarswapId, providers, logger)`: Deploy a new Lunarswap contract
- `subscribe(lunarswapId, providers, contractAddress, logger)`: Subscribe to an existing contract
- `contractExists(providers, contractAddress)`: Check if a contract exists
- `getPublicKey(providers)`: Get the public key from private state

#### Instance Methods

- `addLiquidity(tokenA, tokenB, amountAMin, amountBMin, to)`: Add liquidity to a pair
- `removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to)`: Remove liquidity from a pair
- `swapExactTokensForTokens(tokenIn, tokenOut, amountIn, amountOutMin, to)`: Swap exact tokens for tokens
- `swapTokensForExactTokens(tokenIn, tokenOut, amountIn, amountOutMin, to)`: Swap tokens for exact tokens
- `isPairExists(tokenA, tokenB)`: Check if a pair exists
- `getAllPairLength()`: Get the total number of pairs
- `getPair(tokenA, tokenB)`: Get pair information
- `getPairReserves(tokenA, tokenB)`: Get pair reserves
- `getPairIdentity(tokenA, tokenB)`: Get pair identity
- `getLpTokenName()`: Get LP token name
- `getLpTokenSymbol()`: Get LP token symbol
- `getLpTokenDecimals()`: Get LP token decimals
- `getLpTokenType()`: Get LP token type
- `getLpTokenTotalSupply(tokenA, tokenB)`: Get LP token total supply

#### Properties

- `state$`: Observable of the current contract state
- `actions$`: Subject for user actions
- `privateStates$`: Subject for private state updates
- `deployedContractAddress`: The deployed contract address

## Architecture

This package follows the same reactive pattern as the battleship API:

1. **State Management**: Uses RxJS observables to track contract state changes
2. **User Actions**: Tracks user actions through subjects
3. **Private State**: Manages private state updates
4. **Error Handling**: Provides retry mechanisms for failed operations
5. **Logging**: Comprehensive logging for debugging and monitoring

## Dependencies

- `@midnight-dapps/lunarswap-v1`: Lunarswap contract implementation
- `@midnight-dapps/compact-std`: Compact standard library
- `@midnight-ntwrk/compact-runtime`: Compact runtime
- `@midnight-ntwrk/ledger`: Ledger implementation
- `@midnight-ntwrk/midnight-js-contracts`: Midnight contracts
- `@midnight-ntwrk/midnight-js-types`: Midnight types
- `rxjs`: Reactive programming library
- `pino`: Logging library 