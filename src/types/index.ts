/**
 * Shared type definitions for the Override Studio extension.
 *
 * These types are intentionally UI-agnostic so they can be consumed by the
 * rule engine, storage layer, and React UI alike.
 */

/** HTTP methods a rule can target. `ANY` matches every method. */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'ANY';

/** How the request body is interpreted when matching. */
export type PayloadType = 'json' | 'form-data' | 'none';

/** Strategy used to compare a rule's URL pattern against a request URL. */
export type UrlMatchType =
  | 'exact'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'regex';

/** Operators used to compare a single value (header, query param, field, etc.). */
export type MatchOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'regex'
  | 'exists';

/** A primitive value that a JSON condition can compare against. */
export type JsonPrimitive = string | number | boolean | null;

/** Condition applied to a key/value pair (query params, headers, form fields). */
export interface KeyValueCondition {
  key: string;
  operator: MatchOperator;
  /** Not required when operator is `exists`. */
  value?: string;
}

/** Condition applied to a value inside a JSON request body. */
export interface JsonCondition {
  /** Dot/bracket path into the JSON body, e.g. `user.id` or `items[0].name`. */
  path: string;
  operator: MatchOperator;
  /** Not required when operator is `exists`. */
  value?: JsonPrimitive;
}

/** Configures how a request URL is matched. */
export interface UrlMatcherConfig {
  pattern: string;
  matchType: UrlMatchType;
}

/**
 * All the conditions that describe when a rule should apply, beyond URL and
 * method. Every provided group must match for the rule to match.
 */
export interface RequestConditions {
  queryParams?: KeyValueCondition[];
  headers?: KeyValueCondition[];
  /** Conditions evaluated when payloadType is `json`. */
  jsonBody?: JsonCondition[];
  /** Conditions evaluated when payloadType is `form-data`. */
  formData?: KeyValueCondition[];
}

/** The request-side of a rule: what incoming request should this rule match? */
export interface RuleRequest {
  url: UrlMatcherConfig;
  method: HttpMethod;
  payloadType: PayloadType;
  conditions: RequestConditions;
}

/** The response-side of a rule: what should be returned when it matches? */
export interface RuleResponse {
  status: number;
  headers: Record<string, string>;
  /** Response body stored as a string; interpreted based on headers/content. */
  body: string;
  /** Artificial delay in milliseconds before responding. */
  delay: number;
}

/** A complete override rule as persisted in storage. */
export interface OverrideRule {
  id: string;
  name: string;
  enabled: boolean;
  /** Higher priority rules are evaluated first. */
  priority: number;
  request: RuleRequest;
  response: RuleResponse;
  createdAt: number;
  updatedAt: number;
}

/**
 * A normalized representation of an intercepted request. The rule engine
 * matches against this shape. (Population of this object from real network
 * traffic is NOT implemented yet.)
 */
export interface CapturedRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  payloadType: PayloadType;
  /** Present when payloadType is `json`. */
  jsonBody?: unknown;
  /** Present when payloadType is `form-data`. */
  formData?: Record<string, string>;
}

/** Generic matcher contract used by the rule engine's building blocks. */
export interface Matcher<TConfig, TInput> {
  matches(config: TConfig, input: TInput): boolean;
}
