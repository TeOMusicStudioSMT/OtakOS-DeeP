import { CryptoAddress } from '../types';

/**
 * Sovereign wallet addresses for Katedra OtakOS ecosystem donations.
 * Edit this file to update all wallet references across the application.
 * Production: these can also be injected via VITE_WALLET_* env vars at build time.
 */
export const WALLET_ADDRESSES = {
  METAMASK: import.meta.env.VITE_WALLET_METAMASK ?? '0x348Eb1119B19e0eD4Cf51438453771242B3f8A4C',
  LITEWALLET: import.meta.env.VITE_WALLET_LITEWALLET ?? '0xedd21c68cbc84b2d5c402aa1d986f92ff079b7d1',
} as const;

/**
 * Full CRYPTO_DONATIONS config — consumes sovereign wallet addresses above.
 * Exported for use in data.ts and anywhere else in the app.
 */
export const CRYPTO_DONATIONS_CONFIG: CryptoAddress[] = [
  {
    network: 'MetaMask - Główny Portfel EVM (Ethereum, BASE, Linea, Polygon, BSC, Optimism)',
    symbol: 'EVM/MetaMask',
    address: WALLET_ADDRESSES.METAMASK,
    color: 'indigo',
  },
  {
    network: 'Web3 Lite Wallet - Portfel Web3 (otakos.wtf)',
    symbol: 'EVM/LiteWallet',
    address: WALLET_ADDRESSES.LITEWALLET,
    color: 'emerald',
  },
];

/**
 * Regular support channels (fiat gateways).
 */
export const FIAT_DONATIONS_CONFIG = {
  PAYPAL: import.meta.env.VITE_DONATE_PAYPAL ?? 'https://paypal.me/TeOMusicStudio',
  BUY_ME_A_COFFEE: import.meta.env.VITE_DONATE_COFFEE ?? 'https://buymeacoffee.com/TeOMusicStudio',
} as const;

