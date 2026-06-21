/**
 * 🔑 IdentityService — Klient Tożsamości Węzła Katedry
 *
 * Pobiera dane tożsamości z lokalnego mostu (wiesio-bridge.js).
 * W przypadku wersji czysto statycznej (np. Cloud Run/github pages) generuje
 * i zapisuje tożsamość lokalnie w localStorage, zachowując spójność działania.
 */

const BRIDGE_URL = 'http://127.0.0.1:3001';

export interface NodeIdentity {
  address: string;
  p2pNodeId: string;
}

/**
 * Generuje losowy adres portfela EVM do celów demo/statycznych.
 */
function generateMockEVMAddress(): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  // Generowanie prawidłowego adresu EVM (40 znaków hex)
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  // Zamiana na checksum (prosta wersja wizualna lub mixcase)
  return addr.slice(0, 2) + addr.slice(2).split('').map((char, index) => {
    return index % 3 === 0 ? char.toUpperCase() : char;
  }).join('');
}

/**
 * Generuje unikalne ID węzła P2P do celów demo.
 */
function generateMockP2PId(): string {
  const chars = '0123456789abcdef';
  let id = 'peer_';
  for (let i = 0; i < 32; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export class IdentityService {
  private static identityCache: NodeIdentity | null = null;

  /**
   * Pobiera tożsamość węzła z API lub generuje lokalną w przeglądarce.
   */
  static async fetchIdentity(): Promise<NodeIdentity> {
    if (this.identityCache) {
      return this.identityCache;
    }

    try {
      const response = await fetch(`${BRIDGE_URL}/api/identity`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.address && data.p2pNodeId) {
          this.identityCache = {
            address: data.address,
            p2pNodeId: data.p2pNodeId,
          };
          return this.identityCache;
        }
      }
    } catch (e) {
      // Ignorujemy błąd połączenia - most wiesio-bridge prawdopodobnie nie działa w tle
    }

    // Wyszukanie w localStorage
    const localAddr = localStorage.getItem('otakos_node_address');
    const localP2P = localStorage.getItem('otakos_node_p2p_id');

    if (localAddr && localP2P) {
      this.identityCache = {
        address: localAddr,
        p2pNodeId: localP2P,
      };
      return this.identityCache;
    }

    // Wygenerowanie nowej tożsamości lokalnej
    const newAddr = generateMockEVMAddress();
    const newP2P = generateMockP2PId();
    
    localStorage.setItem('otakos_node_address', newAddr);
    localStorage.setItem('otakos_node_p2p_id', newP2P);

    this.identityCache = {
      address: newAddr,
      p2pNodeId: newP2P,
    };
    return this.identityCache;
  }
}

export default IdentityService;
