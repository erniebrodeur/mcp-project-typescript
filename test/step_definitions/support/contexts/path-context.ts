/**
 * Path Context
 * Manages path normalization, validation, and related state
 */
import {
  PathValidationStatus,
  PathValidationResult
} from '../../../../src/schemas/common/path-handling';

export class PathContext {
  // Path handling configuration
  pathNormalizationEnabled: boolean = false;
  approvedDirectories: string[] = [];
  projectRoots: string[] = [];
  
  // Current path state
  currentPath: string = '';
  normalizedPath: string = '';
  validationResult: PathValidationResult | null = null;
  
  // URI processing state
  uri: string = '';
  uriTemplate: string = '';
  extractedParam: string = '';
  securityResult: string | PathValidationStatus = '';
  
  /**
   * Enable path normalization
   */
  enablePathNormalization(): void {
    this.pathNormalizationEnabled = true;
  }
  
  /**
   * Add approved directory
   */
  addApprovedDirectory(directory: string): void {
    if (!this.approvedDirectories.includes(directory)) {
      this.approvedDirectories.push(directory);
    }
  }
  
  /**
   * Add project root
   */
  addProjectRoot(root: string): void {
    if (!this.projectRoots.includes(root)) {
      this.projectRoots.push(root);
    }
  }
  
  /**
   * Set current path
   */
  setCurrentPath(path: string): void {
    this.currentPath = path;
  }
  
  /**
   * Simulate path normalization (stub for red test phase)
   */
  normalizePath(path: string): string {
    // In red test phase, just return the path
    // This will be implemented properly later
    this.normalizedPath = path;
    return path;
  }
  
  /**
   * Simulate path validation (stub for red test phase)
   */
  validatePath(path: string): PathValidationResult {
    // In red test phase, just return a stub result
    // This will be implemented properly later
    this.validationResult = {
      status: PathValidationStatus.Invalid, // Will cause test to fail
      normalizedPath: path,
      originalPath: path,
      isApproved: false
    };
    
    return this.validationResult;
  }
}
