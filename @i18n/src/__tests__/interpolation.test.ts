import { describe, it, expect } from 'vitest';
import { interpolate, extractVariables, clearInterpolationCache } from '../utils/interpolation';

describe('String Interpolation', () => {
  describe('interpolate function', () => {
    it('should interpolate single variable', () => {
      const result = interpolate('Hello {{name}}!', { name: 'John' });
      expect(result).toBe('Hello John!');
    });

    it('should interpolate multiple variables', () => {
      const result = interpolate('{{greeting}} {{name}}, you have {{count}} messages', {
        greeting: 'Hello',
        name: 'John',
        count: 5
      });
      expect(result).toBe('Hello John, you have 5 messages');
    });

    it('should handle variables with whitespace', () => {
      const result = interpolate('Hello {{ name }}!', { name: 'John' });
      expect(result).toBe('Hello John!');
    });

    it('should keep placeholder for missing variables', () => {
      const result = interpolate('Hello {{name}}, {{missing}}!', { name: 'John' });
      expect(result).toBe('Hello John, {{missing}}!');
    });

    it('should handle empty variables object', () => {
      const result = interpolate('Hello {{name}}!', {});
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle undefined variables', () => {
      const result = interpolate('Hello {{name}}!');
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle templates without variables', () => {
      const result = interpolate('Hello World!', { name: 'John' });
      expect(result).toBe('Hello World!');
    });

    it('should handle different variable types', () => {
      const result = interpolate('Count: {{count}}, Active: {{active}}, Name: {{name}}', {
        count: 42,
        active: true,
        name: 'Test'
      });
      expect(result).toBe('Count: 42, Active: true, Name: Test');
    });

    it('should handle null and undefined values', () => {
      const result = interpolate('Value: {{value}}, Other: {{other}}', {
        value: null,
        other: undefined
      });
      expect(result).toBe('Value: {{value}}, Other: {{other}}');
    });
  });

  describe('extractVariables function', () => {
    it('should extract single variable', () => {
      const variables = extractVariables('Hello {{name}}!');
      expect(variables).toEqual(['name']);
    });

    it('should extract multiple variables', () => {
      const variables = extractVariables('{{greeting}} {{name}}, you have {{count}} messages');
      expect(variables).toEqual(['greeting', 'name', 'count']);
    });

    it('should handle variables with whitespace', () => {
      const variables = extractVariables('Hello {{ name }}!');
      expect(variables).toEqual(['name']);
    });

    it('should handle duplicate variables', () => {
      const variables = extractVariables('{{name}} {{name}} {{other}}');
      expect(variables).toEqual(['name', 'other']);
    });

    it('should handle templates without variables', () => {
      const variables = extractVariables('Hello World!');
      expect(variables).toEqual([]);
    });

    it('should handle empty template', () => {
      const variables = extractVariables('');
      expect(variables).toEqual([]);
    });
  });

  describe('Caching', () => {
    it('should cache interpolation functions', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'John' };
      
      // First call - should compile and cache
      const result1 = interpolate(template, variables);
      
      // Second call - should use cache
      const result2 = interpolate(template, variables);
      
      expect(result1).toBe('Hello John!');
      expect(result2).toBe('Hello John!');
    });

    it('should clear interpolation cache', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'John' };
      
      // First call to populate cache
      interpolate(template, variables);
      
      // Clear cache
      clearInterpolationCache();
      
      // Should still work after clearing cache
      const result = interpolate(template, variables);
      expect(result).toBe('Hello John!');
    });
  });

  describe('Performance', () => {
    it('should handle large number of variables efficiently', () => {
      const variables: Record<string, string> = {};
      let template = 'Start';
      
      for (let i = 0; i < 100; i++) {
        template += ` {{var${i}}}`;
        variables[`var${i}`] = `value${i}`;
      }
      
      const startTime = Date.now();
      const result = interpolate(template, variables);
      const endTime = Date.now();
      
      expect(result).toContain('Start value0');
      expect(result).toContain('value99');
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });
  });
});