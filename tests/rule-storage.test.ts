import { describe, it, expect, beforeEach } from 'vitest';
import { installChromeStorageMock } from './helpers/chrome-mock';
import {
  getRules,
  saveRules,
  addRule,
  updateRule,
  deleteRule,
} from '../src/storage/rule-storage';
import { createRule } from '../src/rules/rule';

describe('rule-storage', () => {
  beforeEach(() => {
    installChromeStorageMock();
  });

  it('returns an empty list when nothing is stored', async () => {
    expect(await getRules()).toEqual([]);
  });

  it('saves and reads back rules', async () => {
    const rules = [createRule({ name: 'A' }), createRule({ name: 'B' })];
    await saveRules(rules);
    expect(await getRules()).toHaveLength(2);
  });

  it('adds a rule', async () => {
    const rule = createRule({ name: 'Added' });
    const next = await addRule(rule);
    expect(next).toHaveLength(1);
    expect((await getRules())[0]?.name).toBe('Added');
  });

  it('updates an existing rule by id', async () => {
    const rule = createRule({ name: 'Original' });
    await addRule(rule);
    await updateRule({ ...rule, name: 'Renamed' });

    const stored = await getRules();
    expect(stored).toHaveLength(1);
    expect(stored[0]?.name).toBe('Renamed');
  });

  it('deletes a rule by id', async () => {
    const first = createRule({ name: 'Keep' });
    const second = createRule({ name: 'Remove' });
    await saveRules([first, second]);

    const next = await deleteRule(second.id);
    expect(next).toHaveLength(1);
    expect(next[0]?.id).toBe(first.id);
  });
});
