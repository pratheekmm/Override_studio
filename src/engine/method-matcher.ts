import type { HttpMethod, Matcher } from '../types';

/** Matches a request's HTTP method against a rule's target method. */
export class MethodMatcher implements Matcher<HttpMethod, string> {
  matches(ruleMethod: HttpMethod, requestMethod: string): boolean {
    if (ruleMethod === 'ANY') return true;
    return ruleMethod.toUpperCase() === requestMethod.toUpperCase();
  }
}

export const methodMatcher = new MethodMatcher();
