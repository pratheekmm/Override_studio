import type {
  HttpMethod,
  OverrideRule,
  PayloadType,
  RuleRequest,
  RuleResponse,
} from '../types';

/** Fields that can be supplied when creating a rule; everything else defaults. */
export interface CreateRuleInput {
  name?: string;
  enabled?: boolean;
  priority?: number;
  request?: Partial<RuleRequest>;
  response?: Partial<RuleResponse>;
}

const DEFAULT_METHOD: HttpMethod = 'ANY';
const DEFAULT_PAYLOAD_TYPE: PayloadType = 'none';

function createId(): string {
  // crypto.randomUUID is available in modern browsers and service workers.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `rule_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildRequest(partial?: Partial<RuleRequest>): RuleRequest {
  return {
    url: partial?.url ?? { pattern: '', matchType: 'contains' },
    method: partial?.method ?? DEFAULT_METHOD,
    payloadType: partial?.payloadType ?? DEFAULT_PAYLOAD_TYPE,
    conditions: partial?.conditions ?? {},
  };
}

function buildResponse(partial?: Partial<RuleResponse>): RuleResponse {
  return {
    status: partial?.status ?? 200,
    headers: partial?.headers ?? {},
    body: partial?.body ?? '',
    delay: partial?.delay ?? 0,
  };
}

/**
 * Creates a fully-formed `OverrideRule` with sensible defaults. This is the single
 * place where new rules are constructed, keeping id/timestamp generation
 * consistent across the app.
 */
export function createRule(input: CreateRuleInput = {}): OverrideRule {
  const now = Date.now();
  return {
    id: createId(),
    name: input.name ?? 'Untitled override',
    enabled: input.enabled ?? true,
    priority: input.priority ?? 0,
    request: buildRequest(input.request),
    response: buildResponse(input.response),
    createdAt: now,
    updatedAt: now,
  };
}
