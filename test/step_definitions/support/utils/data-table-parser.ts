/**
 * Data Table Parser Utility
 * Parses Cucumber data tables to typed objects
 */
import { DataTable } from '@cucumber/cucumber';
import { z } from 'zod';

/**
 * Parse a string value to its appropriate type
 * 
 * @param value The string value to parse
 * @returns The parsed value with its correct type
 */
export function parseStringValue(value: string): any {
  // Handle null
  if (value === 'null') return null;
  
  // Handle booleans
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Handle JSON objects and arrays
  if ((value.startsWith('{') && value.endsWith('}')) || 
      (value.startsWith('[') && value.endsWith(']'))) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // If not valid JSON, return as string
      return value;
    }
  }
  
  // Handle numbers
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  
  // Remove quotes if present
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.substring(1, value.length - 1);
  }
  
  // Return as string
  return value;
}

/**
 * Parse a Cucumber data table to a typed object
 * 
 * @param dataTable The Cucumber data table
 * @param schema Optional Zod schema for validation
 * @returns Parsed object with appropriate types
 */
export function parseDataTable<T>(
  dataTable: DataTable, 
  schema?: z.ZodType<T>
): T {
  // Get raw key-value pairs
  const raw = dataTable.rowsHash();
  
  // Convert string values to appropriate types
  const parsed = Object.entries(raw).reduce<Record<string, any>>((acc, [key, value]) => {
    acc[key] = parseStringValue(value as string);
    return acc;
  }, {});
  
  // Validate against schema if provided
  if (schema) {
    return schema.parse(parsed);
  }
  
  return parsed as T;
}
