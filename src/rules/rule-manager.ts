import type { OverrideRule } from '../types';
import { ruleStorage, type RuleStorage } from '../storage/rule-storage';
import { createRule, type CreateRuleInput } from './rule';

/**
 * Coordinates rule creation and mutation on top of a {@link RuleStorage}.
 *
 * This is the layer the UI talks to for rule operations, keeping business logic
 * (id generation, timestamps, toggling) out of React components. Storage is
 * injected so it can be swapped for a fake in tests.
 */
export class RuleManager {
  constructor(private readonly storage: RuleStorage = ruleStorage) {}

  list(): Promise<OverrideRule[]> {
    return this.storage.getRules();
  }

  /** Builds a new rule from partial input and persists it. */
  async create(input: CreateRuleInput = {}): Promise<OverrideRule> {
    const rule = createRule(input);
    await this.storage.addRule(rule);
    return rule;
  }

  /** Persists changes to an existing rule, refreshing its updatedAt stamp. */
  async update(rule: OverrideRule): Promise<OverrideRule> {
    const updated: OverrideRule = { ...rule, updatedAt: Date.now() };
    await this.storage.updateRule(updated);
    return updated;
  }

  remove(id: string): Promise<OverrideRule[]> {
    return this.storage.deleteRule(id);
  }

  /** Flips a rule's enabled flag and persists it. */
  async toggle(id: string): Promise<OverrideRule | undefined> {
    const rules = await this.storage.getRules();
    const target = rules.find((rule) => rule.id === id);
    if (!target) return undefined;
    return this.update({ ...target, enabled: !target.enabled });
  }
}

/** Shared manager instance backed by chrome.storage.local. */
export const ruleManager = new RuleManager();
