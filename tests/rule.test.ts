import { describe, it, expect } from 'vitest';
import { createRule } from '../src/rules/rule';

describe('createRule', () => {
  it('creates a rule with sensible defaults', () => {
    const rule = createRule();

    expect(rule.id).toBeTruthy();
    expect(rule.name).toBe('Untitled override');
    expect(rule.enabled).toBe(true);
    expect(rule.priority).toBe(0);
    expect(rule.request.method).toBe('ANY');
    expect(rule.request.payloadType).toBe('none');
    expect(rule.response.status).toBe(200);
    expect(rule.response.delay).toBe(0);
    expect(rule.createdAt).toBeTypeOf('number');
    expect(rule.updatedAt).toBe(rule.createdAt);
  });

  it('applies provided overrides', () => {
    const rule = createRule({
      name: 'Login mock',
      priority: 5,
      enabled: false,
      request: {
        method: 'POST',
        payloadType: 'json',
        url: { pattern: '/api/login', matchType: 'contains' },
      },
      response: { status: 401, delay: 250, body: '{"error":"nope"}' },
    });

    expect(rule.name).toBe('Login mock');
    expect(rule.priority).toBe(5);
    expect(rule.enabled).toBe(false);
    expect(rule.request.method).toBe('POST');
    expect(rule.request.payloadType).toBe('json');
    expect(rule.request.url.pattern).toBe('/api/login');
    expect(rule.response.status).toBe(401);
    expect(rule.response.delay).toBe(250);
  });

  it('generates unique ids for distinct rules', () => {
    const a = createRule();
    const b = createRule();
    expect(a.id).not.toBe(b.id);
  });
});
