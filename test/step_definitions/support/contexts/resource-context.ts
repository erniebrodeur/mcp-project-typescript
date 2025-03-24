/**
 * Resource Context
 * Manages resource registration, responses, and state
 */
import { 
  ResourceResponse
} from '../../../../src/schemas/server/response-schema';
import {
  ErrorResponse
} from '../../../../src/schemas/server/error-schema';

// Resource types
export type ResourceType = 
  'project' | 
  'package' | 
  'testing' | 
  'files' | 
  'documentation' | 
  'deployment';

export class ResourceContext {
  // Registered resources
  registeredResources: ResourceType[] = [];
  
  // Current resource state
  currentResourceType: ResourceType | null = null;
  
  // Response data
  response: ResourceResponse | { error: ErrorResponse } | null = null;
  
  // Current project properties
  projectType: string = '';
  projectPath: string = '';
  
  // Current package properties
  packagePath: string = '';
  packageExists: boolean = true;
  packageHasOptionalFields: boolean = false;
  
  // Current URI info
  requestedUri: string = '';
  
  /**
   * Register a resource type
   */
  registerResource(resourceType: ResourceType): void {
    if (!this.registeredResources.includes(resourceType)) {
      this.registeredResources.push(resourceType);
    }
  }
  
  /**
   * Set current resource type
   */
  setCurrentResource(resourceType: ResourceType): void {
    this.currentResourceType = resourceType;
  }
  
  /**
   * Store a response
   */
  setResponse(response: ResourceResponse | { error: ErrorResponse }): void {
    this.response = response;
  }
  
  /**
   * Get the current response
   */
  getResponse<T>(): ResourceResponse<T> | { error: ErrorResponse } | null {
    return this.response;
  }
  
  /**
   * Check if a resource is registered
   */
  hasResource(resourceType: ResourceType): boolean {
    return this.registeredResources.includes(resourceType);
  }
  
  /**
   * Clear response data
   */
  clearResponse(): void {
    this.response = null;
  }
}
