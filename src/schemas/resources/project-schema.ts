import { z } from 'zod';

/**
 * Project Resource Schema
 * Defines the structure of data returned by the project:// resource
 */

// Project framework schema
export const frameworkSchema = z.record(z.string());

// Project type enum
export const projectTypeEnum = z.enum([
  'Next.js',
  'Express',
  'React',
  'Node.js',
  'Vue',
  'Angular',
  'NestJS',
  'Fastify',
  'Other'
]);

// Module system type
export const moduleSystemEnum = z.enum(['ESM', 'CommonJS']);

// Validator for project resource
export const projectSchemaValidator = z.object({
  project_type: projectTypeEnum,
  entry_points: z.array(z.string()),
  framework: frameworkSchema,
  test_framework: frameworkSchema,
  key_config_files: z.record(z.boolean()),
  core_directories: z.record(z.boolean()),
  node_version: z.string(),
  typescript: z.boolean(),
  module_system: moduleSystemEnum
});

// TypeScript type derived from Zod schema
export type ProjectSchema = z.infer<typeof projectSchemaValidator>;

// Helper for creating consistent project responses
export function createProjectResponse(data: ProjectSchema): ProjectSchema {
  return projectSchemaValidator.parse(data);
}
