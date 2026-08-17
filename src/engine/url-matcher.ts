import type { Matcher, UrlMatcherConfig } from '../types';

/** Matches a request URL against a rule's {@link UrlMatcherConfig}. */
export class UrlMatcher implements Matcher<UrlMatcherConfig, string> {
  matches(config: UrlMatcherConfig, url: string): boolean {
    const { pattern, matchType } = config;
    if (!pattern) return false;

    switch (matchType) {
      case 'exact':
        return url === pattern;
      case 'contains':
        return url.includes(pattern);
      case 'startsWith':
        return url.startsWith(pattern);
      case 'endsWith':
        return url.endsWith(pattern);
      case 'regex':
        return this.matchesRegex(pattern, url);
      default:
        return false;
    }
  }

  private matchesRegex(pattern: string, url: string): boolean {
    try {
      return new RegExp(pattern).test(url);
    } catch {
      // Invalid regex patterns never match rather than throwing.
      return false;
    }
  }
}

export const urlMatcher = new UrlMatcher();
