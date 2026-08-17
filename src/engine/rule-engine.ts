import type {
  CapturedRequest,
  KeyValueCondition,
  OverrideRule,
} from '../types';
import { UrlMatcher } from './url-matcher';
import { MethodMatcher } from './method-matcher';
import { PayloadMatcher } from './payload-matcher';

/**
 * Decides which mock rule (if any) applies to a captured request.
 *
 * The engine is intentionally decoupled from the UI and from any network layer.
 * It only answers the question "given this request and these rules, which rule
 * matches?". Actually intercepting traffic and producing a mocked response is
 * NOT implemented yet.
 */
export class RuleEngine {
  constructor(
    private readonly urlMatcher: UrlMatcher = new UrlMatcher(),
    private readonly methodMatcher: MethodMatcher = new MethodMatcher(),
    private readonly payloadMatcher: PayloadMatcher = new PayloadMatcher(),
  ) {}

  /**
   * Returns the highest-priority enabled rule that matches the request, or
   * `null` when nothing matches.
   */
  findMatchingRule(
    request: CapturedRequest,
    rules: OverrideRule[],
  ): OverrideRule | null {
    const candidates = rules
      .filter((rule) => rule.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of candidates) {
      if (this.matches(rule, request)) return rule;
    }
    return null;
  }

  /** Evaluates a single rule against a request across all matcher dimensions. */
  matches(rule: OverrideRule, request: CapturedRequest): boolean {
    if (!this.urlMatcher.matches(rule.request.url, request.url)) return false;
    if (!this.methodMatcher.matches(rule.request.method, request.method)) {
      return false;
    }
    if (
      !matchKeyValues(rule.request.conditions.queryParams, request.queryParams)
    ) {
      return false;
    }
    if (!matchKeyValues(rule.request.conditions.headers, request.headers)) {
      return false;
    }
    if (!this.payloadMatcher.matches(rule.request, request)) return false;
    return true;
  }
}

/** Evaluates key/value conditions against a flat map (headers, query params). */
function matchKeyValues(
  conditions: KeyValueCondition[] | undefined,
  values: Record<string, string>,
): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition) => {
    const present = Object.prototype.hasOwnProperty.call(
      values,
      condition.key,
    );
    const actual = values[condition.key];

    switch (condition.operator) {
      case 'exists':
        return present;
      case 'equals':
        return actual === condition.value;
      case 'notEquals':
        return actual !== condition.value;
      case 'contains':
        return (actual ?? '').includes(condition.value ?? '');
      case 'regex':
        try {
          return new RegExp(condition.value ?? '').test(actual ?? '');
        } catch {
          return false;
        }
      default:
        return false;
    }
  });
}

export const ruleEngine = new RuleEngine();
