import type { CapturedRequest, Matcher, RuleRequest } from '../types';
import { JsonMatcher } from './json-matcher';
import { FormDataMatcher } from './formdata-matcher';

/**
 * Matches a request's payload against a rule's payload conditions by delegating
 * to the JSON or form-data matcher based on the rule's declared payload type.
 */
export class PayloadMatcher implements Matcher<RuleRequest, CapturedRequest> {
  constructor(
    private readonly jsonMatcher: JsonMatcher = new JsonMatcher(),
    private readonly formDataMatcher: FormDataMatcher = new FormDataMatcher(),
  ) {}

  matches(rule: RuleRequest, request: CapturedRequest): boolean {
    switch (rule.payloadType) {
      case 'none':
        return true;
      case 'json':
        return this.jsonMatcher.matches(
          rule.conditions.jsonBody ?? [],
          request.jsonBody,
        );
      case 'form-data':
        return this.formDataMatcher.matches(
          rule.conditions.formData ?? [],
          request.formData ?? {},
        );
      default:
        return false;
    }
  }
}

export const payloadMatcher = new PayloadMatcher();
