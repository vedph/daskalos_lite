/**
 * Paging options.
 */
export interface PagingOptions {
  pageNumber: number;
  pageSize: number;
}

/**
 * Paged data returned by API.
 */
export interface PagedData<T> {
  total: number;
  items: T[];
}

/**
 * A single choice in a flow's step.
 */
export interface FlowChoice {
  number: number;
  targetStepNumber: number;
  label: string;
  isFree: boolean;
  maxLength: number;
  validationPattern: string;
  validationMessage: string;
  score: number;
  // not from server
  checked: boolean;
  freeContent: string;
}

/**
 * A single step in a flow.
 */
export interface FlowStep {
  number: number;
  label: string;
  prompt: string;
  content?: string;
  maxChoices?: number;
  timeAllotted?: number;
  expiredTarget?: number;
  choices: FlowChoice[];
}

/**
 * A flow.
 */
export interface Flow {
  id: string;
  label: string;
  description: string;
  author: string;
  category: string;
  lastUpdated: Date;
  minScore: number;
  steps: FlowStep[];
}

export interface FlowUserChoice {
  stepNumber: number;
  number: number;
  label: string;
  checked: boolean;
  isFree: boolean;
  freeContent: string;
  score: number;
  targetStepNumber: number;
}

export interface FlowUserStep {
  number: number;
  label: string;
  prompt: string;
  choices: FlowUserChoice[];
  isFree?: boolean;
}

export interface FlowUserSummary {
  id: string;
  label: string;
  minScore: number;
  steps: FlowUserStep[];
}

/**
 * Filter for flows.
 */
export interface FlowFilter extends PagingOptions {
  label?: string;
  category?: string;
  author?: string;
}

/**
 * Essential information about a flow.
 */
export interface FlowInfo {
  id: string;
  label: string;
  description: string;
  author: string;
  category: string;
  lastUpdated: Date;
  minScore: number;
  stepCount: number;
}
