import type { JsonCondition, Matcher } from '../types';

/**
 * Matches JSON request bodies against a set of {@link JsonCondition}s.
 * All conditions must pass for the body to be considered a match.
 */
export class JsonMatcher implements Matcher<JsonCondition[], unknown> {
  matches(conditions: JsonCondition[], body: unknown): boolean {
    if (conditions.length === 0) return true;
    return conditions.every((condition) => this.matchOne(condition, body));
  }

  private matchOne(condition: JsonCondition, body: unknown): boolean {
    const actual = resolvePath(body, condition.path);

    switch (condition.operator) {
      case 'exists':
        return actual !== undefined;
      case 'equals':
        return actual === condition.value;
      case 'notEquals':
        return actual !== condition.value;
      case 'contains':
        return String(actual).includes(String(condition.value ?? ''));
      case 'regex':
        return safeRegexTest(String(condition.value ?? ''), String(actual));
      default:
        return false;
    }
  }
}

/** Resolves a dotted/bracketed path like `user.roles[0]` inside a value. */
export function resolvePath(source: unknown, path: string): unknown {
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let current: unknown = source;
  for (const segment of segments) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function safeRegexTest(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
}

export const jsonMatcher = new JsonMatcher();
