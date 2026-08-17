import { describe, it, expect } from 'vitest';
import { RuleEngine } from '../src/engine/rule-engine';
import { UrlMatcher } from '../src/engine/url-matcher';
import { MethodMatcher } from '../src/engine/method-matcher';
import { createRule } from '../src/rules/rule';
import type { CapturedRequest } from '../src/types';

function request(overrides: Partial<CapturedRequest> = {}): CapturedRequest {
  return {
    url: 'https://api.example.com/users',
    method: 'GET',
    headers: {},
    queryParams: {},
    payloadType: 'none',
    ...overrides,
  };
}

describe('UrlMatcher', () => {
  const matcher = new UrlMatcher();

  it('supports contains matching', () => {
    expect(
      matcher.matches({ pattern: '/users', matchType: 'contains' }, '/api/users'),
    ).toBe(true);
  });

  it('returns false for an empty pattern', () => {
    expect(matcher.matches({ pattern: '', matchType: 'exact' }, '/api')).toBe(
      false,
    );
  });
});

describe('MethodMatcher', () => {
  const matcher = new MethodMatcher();

  it('matches ANY against every method', () => {
    expect(matcher.matches('ANY', 'DELETE')).toBe(true);
  });

  it('matches case-insensitively', () => {
    expect(matcher.matches('POST', 'post')).toBe(true);
    expect(matcher.matches('POST', 'GET')).toBe(false);
  });
});

describe('RuleEngine', () => {
  const engine = new RuleEngine();

  it('returns null when no rules match', () => {
    const rules = [
      createRule({
        request: { url: { pattern: '/orders', matchType: 'contains' } },
      }),
    ];
    expect(engine.findMatchingRule(request(), rules)).toBeNull();
  });

  it('matches a rule on url and method', () => {
    const rule = createRule({
      request: {
        method: 'GET',
        url: { pattern: '/users', matchType: 'contains' },
      },
    });
    const match = engine.findMatchingRule(request(), [rule]);
    expect(match?.id).toBe(rule.id);
  });

  it('ignores disabled rules', () => {
    const rule = createRule({
      enabled: false,
      request: { url: { pattern: '/users', matchType: 'contains' } },
    });
    expect(engine.findMatchingRule(request(), [rule])).toBeNull();
  });

  it('prefers the higher-priority rule', () => {
    const low = createRule({
      name: 'low',
      priority: 1,
      request: { url: { pattern: '/users', matchType: 'contains' } },
    });
    const high = createRule({
      name: 'high',
      priority: 10,
      request: { url: { pattern: '/users', matchType: 'contains' } },
    });
    const match = engine.findMatchingRule(request(), [low, high]);
    expect(match?.id).toBe(high.id);
  });
});
