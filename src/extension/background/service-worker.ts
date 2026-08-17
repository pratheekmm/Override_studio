/**
 * MV3 background service worker.
 *
 * This is a stub for the foundation phase. Network interception and response
 * overriding are intentionally NOT implemented yet. It currently only logs its
 * lifecycle so we can confirm the worker loads in the extension.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.info('[Override Studio] service worker installed.');
});

// Keeping an explicit export makes this file an ES module, matching
// "type": "module" in the manifest's background declaration.
export {};
