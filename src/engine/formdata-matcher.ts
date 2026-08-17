import type { KeyValueCondition, Matcher } from '../types';

/** A flat map of multipart/form-data field names to their string values. */
export type FormDataFields = Record<string, string>;

/**
 * Matches multipart/form-data fields against {@link KeyValueCondition}s.
 * All conditions must pass for the form data to be considered a match.
 */
export class FormDataMatcher
  implements Matcher<KeyValueCondition[], FormDataFields>
{
  matches(conditions: KeyValueCondition[], fields: FormDataFields): boolean {
    if (conditions.length === 0) return true;
    return conditions.every((condition) => this.matchOne(condition, fields));
  }

  private matchOne(
    condition: KeyValueCondition,
    fields: FormDataFields,
  ): boolean {
    const present = Object.prototype.hasOwnProperty.call(
      fields,
      condition.key,
    );
    const actual = fields[condition.key];

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
        return safeRegexTest(condition.value ?? '', actual ?? '');
      default:
        return false;
    }
  }
}

function safeRegexTest(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
}

export const formDataMatcher = new FormDataMatcher();
