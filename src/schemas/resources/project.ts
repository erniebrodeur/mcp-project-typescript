import { z } from 'zod';
import { resourceResponseSchema } from '../core/resources';

/**
 * Project Resource Schema
 * Defines the structure of project:// resource responses
 */

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
  'Other',
]);

// Module system enum
export const moduleSystemEnum = z.enum([
  'ESM',
  'CommonJS',
]);

// Framework object schema (name-version pairs)
export const frameworkSchema = z.record(z.string());

// Project core schema
export const projectSchema = z.object({
  project_type: projectTypeEnum,
  entry_points: z.array(z.string()),
  framework: frameworkSchema,
  test_framework: frameworkSchema,
  key_config_files: z.record(z.boolean()),
  core_directories: z.record(z.boolean()),
  node_version: z.string(),
  typescript: z.boolean(),
  module_system: moduleSystemEnum,
});

// Project resource response schema
export const projectResponseSchema = resourceResponseSchema.extend({
  data: projectSchema.optional(),
});

// TypeScript types
export type ProjectType = z.infer<typeof projectTypeEnum>;
export type ModuleSystem = z.infer<typeof moduleSystemEnum>;
export type Framework = z.infer<typeof frameworkSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;

// URI template for project resource
export const PROJECT_URI_TEMPLATE = 'project://{path}';

// Helper function to create a project resource response
export function createProjectResponse(
  uri: string,
  project: Project
): ProjectResponse {
  return {
    contents: [{
      uri,
      text: JSON.stringify(project),
    }],
    data: project,
  };
}
