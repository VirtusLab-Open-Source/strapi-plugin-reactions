import { isArray } from 'lodash';
import { ZodIssue } from 'zod';

export type FormErrors = Record<string, string>;

// Keeps raw translation keys from the schema - translate them while rendering, hooks can't be used in event handlers
export const getFormErrors = (issues: Array<ZodIssue> = []): FormErrors =>
  issues.reduce((acc, error: ZodIssue) => {
    const path = isArray(error?.path) ? error?.path.join('.') : error?.path;
    return {
      ...acc,
      [path]: error?.message,
    };
  }, {});
