/**
 * Minimal in-memory stand-in for `chrome.storage.local`, sufficient for the
 * storage layer's get/set usage. Installed on `globalThis.chrome` in tests.
 */
export function installChromeStorageMock(): void {
  const store: Record<string, unknown> = {};

  const local = {
    get: async (key: string) => {
      return key in store ? { [key]: store[key] } : {};
    },
    set: async (items: Record<string, unknown>) => {
      Object.assign(store, items);
    },
    clear: async () => {
      for (const key of Object.keys(store)) delete store[key];
    },
  };

  // Cast through unknown because we only implement the subset we use.
  (globalThis as unknown as { chrome: unknown }).chrome = {
    storage: { local },
  };
}
