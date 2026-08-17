import type { OverrideRule } from '../types';

const STORAGE_KEY = 'overrideStudio.rules';

/**
 * Persistence contract for override rules. Kept as an interface so the React UI and
 * rule manager depend on the abstraction rather than on `chrome.storage`
 * directly, which also makes the layer easy to fake in tests.
 */
export interface RuleStorage {
  getRules(): Promise<OverrideRule[]>;
  saveRules(rules: OverrideRule[]): Promise<void>;
  addRule(rule: OverrideRule): Promise<OverrideRule[]>;
  updateRule(rule: OverrideRule): Promise<OverrideRule[]>;
  deleteRule(id: string): Promise<OverrideRule[]>;
}

/** Reads all rules from chrome.storage.local. Returns [] when none exist. */
export async function getRules(): Promise<OverrideRule[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const rules = result[STORAGE_KEY] as OverrideRule[] | undefined;
  return rules ?? [];
}

/** Overwrites the full rule list in chrome.storage.local. */
export async function saveRules(rules: OverrideRule[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: rules });
}

/** Appends a rule and persists the updated list. */
export async function addRule(rule: OverrideRule): Promise<OverrideRule[]> {
  const rules = await getRules();
  const next = [...rules, rule];
  await saveRules(next);
  return next;
}

/** Replaces an existing rule (matched by id) and persists the updated list. */
export async function updateRule(rule: OverrideRule): Promise<OverrideRule[]> {
  const rules = await getRules();
  const next = rules.map((existing) =>
    existing.id === rule.id ? rule : existing,
  );
  await saveRules(next);
  return next;
}

/** Removes a rule by id and persists the updated list. */
export async function deleteRule(id: string): Promise<OverrideRule[]> {
  const rules = await getRules();
  const next = rules.filter((existing) => existing.id !== id);
  await saveRules(next);
  return next;
}

/** Convenience object implementing the {@link RuleStorage} contract. */
export const ruleStorage: RuleStorage = {
  getRules,
  saveRules,
  addRule,
  updateRule,
  deleteRule,
};
