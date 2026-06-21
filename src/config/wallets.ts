import { CryptoAddress } from '../types';

/**
 * Sovereign wallet addresses for Katedra OtakOS ecosystem donations.
 * Edit this file to update all wallet references across the application.
 * Production: these can also be injected via VITE_WALLET_* env vars at build time.
 */
export const WALLET_ADDRESSES: Record<string, string> = {
  XMR: import.meta.env.VITE_WALLET_XMR ?? '44AFFq5kSiGbUpxZ2Z267FFj9bN8ydD1L2m8vBCr67Z6Jp5LQRbN7Z2x45T6bZ7Y2B5R4A7C9N8m3J5G2V9B3X8L3N8K9F2QG',
  ETH: import.meta.env.VITE_WALLET_ETH ?? '0x348E72D7cFE2A376f9202584C79fD89b335Bf24C',
  BTC: import.meta.env.VITE_WALLET_BTC ?? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  SOL: import.meta.env.VITE_WALLET_SOL ?? '0x348E72D7cFE2A376f9202584C79fD89b335Bf24C',
};

/**
 * Full CRYPTO_DONATIONS config — consumes sovereign wallet addresses above.
 * Exported for use in data.ts and anywhere else in the app.
 */
export const CRYPTO_DONATIONS_CONFIG: CryptoAddress[] = [
  {
    network: 'Monero (XMR) - Sovereign Standard',
    symbol: 'XMR',
    address: WALLET_ADDRESSES.XMR,
    color: 'amber',
  },
  {
    network: 'Ethereum (ETH) - Web3 Contract Node',
    symbol: 'ETH',
    address: WALLET_ADDRESSES.ETH,
    color: 'indigo',
  },
  {
    network: 'Bitcoin (BTC) - Deep Cold Core',
    symbol: 'BTC',
    address: WALLET_ADDRESSES.BTC,
    color: 'orange',
  },
  {
    network: 'Solana (SOL) - High-Frequency Terminal',
    symbol: 'SOL',
    address: WALLET_ADDRESSES.SOL,
    color: 'cyan',
  },
];
