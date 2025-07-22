import type { Variables } from '../types';

/**
 * Cached regex for variable interpolation
 * Matches {{variableName}} pattern
 */
const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

/**
 * Cache for compiled interpolation functions
 */
const interpolationCache = new Map<string, (variables: Variables) => string>();

/**
 * Fast string interpolation with caching
 * Replaces {{variableName}} with corresponding values from variables object
 */
export function interpolate(template: string, variables?: Variables): string {
  if (!variables || Object.keys(variables).length === 0) {
    return template;
  }

  // Check cache first
  const cached = interpolationCache.get(template);
  if (cached) {
    return cached(variables);
  }

  // Fast path for templates without variables
  if (!template.includes('{{')) {
    return template;
  }

  // Compile and cache the interpolation function
  const compiledFn = compileInterpolation(template);
  interpolationCache.set(template, compiledFn);
  
  return compiledFn(variables);
}

/**
 * Compile a template into a fast interpolation function
 */
function compileInterpolation(template: string): (variables: Variables) => string {
  return (variables: Variables) => {
    return template.replace(VARIABLE_REGEX, (match, variableName) => {
      const trimmedName = variableName.trim();
      const value = variables[trimmedName];
      
      if (value === undefined || value === null) {
        // In debug mode, we could warn about missing variables
        return match; // Keep original placeholder
      }
      
      return String(value);
    });
  };
}

/**
 * Extract variable names from a template
 * Used for validation and debugging
 */
export function extractVariables(template: string): string[] {
  const variables: string[] = [];
  let match: RegExpExecArray | null;
  
  // Reset regex state
  VARIABLE_REGEX.lastIndex = 0;
  
  while ((match = VARIABLE_REGEX.exec(template)) !== null) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }
  
  return variables;
}

/**
 * Clear the interpolation cache
 * Useful for memory management in long-running applications
 */
export function clearInterpolationCache(): void {
  interpolationCache.clear();
}