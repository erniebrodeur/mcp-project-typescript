/**
 * Fixture Loader Utility
 * Type-safe fixture loading with schema validation
 */
import { z } from 'zod';

/**
 * Loads a fixture file and validates against an optional schema
 * 
 * @param category The fixture category (e.g., 'resources', 'commands')
 * @param type The fixture type (e.g., 'project', 'nextjs')
 * @param schema Optional Zod schema for validation
 * @returns The loaded and validated fixture data
 */
export function loadFixture<T>(
  category: string, 
  type: string, 
  schema?: z.ZodType<T>
): T {
  try {
    // Load the fixture
    const data = require(`../../../fixtures/${category}/${type}.json`);
    
    // Validate against schema if provided
    if (schema) {
      return schema.parse(data);
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load fixture: fixtures/${category}/${type}.json - ${error.message}`);
    }
    throw new Error(`Failed to load fixture: fixtures/${category}/${type}.json`);
  }
}
