/**
 * API Response Validator
 * 
 * Provides runtime validation for API responses to prevent crashes
 * from unexpected data shapes or backend changes.
 */

import { z } from 'zod';
import { AxiosResponse } from 'axios';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ValidationError;
}

export interface ValidationError {
  type: 'validation_error' | 'parse_error' | 'unexpected_error';
  message: string;
  issues?: z.ZodIssue[];
  originalData?: unknown;
  path?: string;
}

/**
 * Validates an API response against a Zod schema
 */
export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  options: {
    endpoint?: string;
    strict?: boolean;
    logErrors?: boolean;
  } = {}
): ValidationResult<T> {
  const { endpoint = 'Unknown endpoint', strict = false, logErrors = true } = options;

  try {
    // Try to parse the data
    const result = schema.safeParse(data);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    // Validation failed
    const error: ValidationError = {
      type: 'validation_error',
      message: `Response validation failed for ${endpoint}`,
      issues: result.error.issues,
      originalData: data,
      path: endpoint,
    };

    if (logErrors) {
      console.error('❌ [Response Validation Error]', {
        endpoint,
        errors: result.error.issues,
        receivedData: data,
      });
    }

    // In strict mode, we don't return partial data
    if (strict) {
      return {
        success: false,
        error,
      };
    }

    // In non-strict mode, try to return partial data if possible
    try {
      const partialResult = schema.parse(data);
      if (logErrors) {
        console.warn('⚠️ [Response Validation] Using partial data despite errors');
      }
      return {
        success: true,
        data: partialResult,
      };
    } catch {
      return {
        success: false,
        error,
      };
    }
  } catch (parseError: any) {
    const error: ValidationError = {
      type: 'parse_error',
      message: `Failed to parse response for ${endpoint}: ${parseError.message}`,
      originalData: data,
      path: endpoint,
    };

    if (logErrors) {
      console.error('❌ [Response Parse Error]', {
        endpoint,
        error: parseError,
        receivedData: data,
      });
    }

    return {
      success: false,
      error,
    };
  }
}

/**
 * Validates an Axios response
 */
export function validateAxiosResponse<T>(
  schema: z.ZodSchema<T>,
  response: AxiosResponse,
  options: {
    endpoint?: string;
    strict?: boolean;
    logErrors?: boolean;
  } = {}
): ValidationResult<T> {
  const endpoint = options.endpoint || response.config.url || 'Unknown';
  
  return validateResponse(schema, response.data, {
    ...options,
    endpoint,
  });
}

/**
 * Wrapper for API calls that validates the response
 */
export async function validateApiCall<T>(
  apiCall: () => Promise<AxiosResponse>,
  schema: z.ZodSchema<T>,
  options: {
    endpoint?: string;
    strict?: boolean;
    logErrors?: boolean;
    fallbackData?: T;
  } = {}
): Promise<ValidationResult<T>> {
  const { fallbackData, ...validateOptions } = options;

  try {
    const response = await apiCall();
    const validation = validateAxiosResponse(schema, response, validateOptions);

    // If validation failed but we have fallback data, use it
    if (!validation.success && fallbackData !== undefined) {
      if (validateOptions.logErrors !== false) {
        console.warn('⚠️ [API Call] Using fallback data due to validation failure');
      }
      return {
        success: true,
        data: fallbackData,
      };
    }

    return validation;
  } catch (error: any) {
    const validationError: ValidationError = {
      type: 'unexpected_error',
      message: `API call failed: ${error.message}`,
      originalData: error.response?.data,
      path: options.endpoint,
    };

    if (options.logErrors !== false) {
      console.error('❌ [API Call Error]', {
        endpoint: options.endpoint,
        error: error.message,
        status: error.response?.status,
      });
    }

    // Use fallback data if available
    if (fallbackData !== undefined) {
      if (options.logErrors !== false) {
        console.warn('⚠️ [API Call] Using fallback data due to network error');
      }
      return {
        success: true,
        data: fallbackData,
      };
    }

    return {
      success: false,
      error: validationError,
    };
  }
}

/**
 * Helper to extract data from validation result or throw
 */
export function unwrapValidation<T>(result: ValidationResult<T>): T {
  if (result.success && result.data !== undefined) {
    return result.data;
  }

  throw new Error(
    result.error?.message || 'Validation failed with no error message'
  );
}

/**
 * Helper to extract data from validation result or return default
 */
export function unwrapValidationOr<T>(
  result: ValidationResult<T>,
  defaultValue: T
): T {
  if (result.success && result.data !== undefined) {
    return result.data;
  }

  return defaultValue;
}

/**
 * Creates a validated API wrapper function
 */
export function createValidatedApiFunction<TArgs extends any[], TResponse>(
  apiFn: (...args: TArgs) => Promise<AxiosResponse>,
  schema: z.ZodSchema<TResponse>,
  options: {
    endpoint?: string;
    strict?: boolean;
    logErrors?: boolean;
  } = {}
) {
  return async (...args: TArgs): Promise<TResponse> => {
    const response = await apiFn(...args);
    const validation = validateAxiosResponse(schema, response, options);
    return unwrapValidation(validation);
  };
}

/**
 * Safely extract results array from paginated response
 */
export function extractResults<T>(
  validation: ValidationResult<{ results?: T[] }>,
  defaultResults: T[] = []
): T[] {
  if (validation.success && validation.data?.results) {
    return validation.data.results;
  }
  return defaultResults;
}

/**
 * Validates and extracts paginated results
 */
export function extractPaginatedResults<T>(
  data: unknown,
  itemSchema: z.ZodSchema<T>,
  endpoint?: string
): T[] {
  try {
    // Try to extract results from various possible shapes
    if (Array.isArray(data)) {
      return z.array(itemSchema).parse(data);
    }

    if (data && typeof data === 'object') {
      const obj = data as any;
      
      // Check for results array
      if (Array.isArray(obj.results)) {
        return z.array(itemSchema).parse(obj.results);
      }

      // Check for data.results
      if (obj.data && Array.isArray(obj.data.results)) {
        return z.array(itemSchema).parse(obj.data.results);
      }

      // Check for direct data array
      if (Array.isArray(obj.data)) {
        return z.array(itemSchema).parse(obj.data);
      }
    }

    console.warn(`⚠️ [${endpoint}] Could not extract results array from response`);
    return [];
  } catch (error: any) {
    console.error(`❌ [${endpoint}] Error extracting results:`, error.message);
    return [];
  }
}

/**
 * Type guard to check if validation was successful
 */
export function isValidationSuccess<T>(
  result: ValidationResult<T>
): result is { success: true; data: T } {
  return result.success && result.data !== undefined;
}

/**
 * Helper to log validation issues for debugging
 */
export function logValidationIssues(
  issues: z.ZodIssue[],
  endpoint?: string
): void {
  console.group(`🔍 [Validation Issues]${endpoint ? ` ${endpoint}` : ''}`);
  
  issues.forEach((issue, index) => {
    console.log(`Issue ${index + 1}:`, {
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
      received: 'received' in issue ? issue.received : 'N/A',
    });
  });
  
  console.groupEnd();
}

/**
 * Creates a safe fallback for failed validations
 */
export function createSafeFallback<T>(
  validation: ValidationResult<T>,
  fallback: T,
  options: {
    logWarning?: boolean;
    context?: string;
  } = {}
): T {
  const { logWarning = true, context = 'API Response' } = options;

  if (validation.success && validation.data !== undefined) {
    return validation.data;
  }

  if (logWarning) {
    console.warn(`⚠️ [${context}] Using fallback data due to validation failure`, {
      error: validation.error?.message,
      issueCount: validation.error?.issues?.length,
    });
  }

  return fallback;
}
