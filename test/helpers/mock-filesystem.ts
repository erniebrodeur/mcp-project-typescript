import { Volume } from 'memfs';

export function setupMockFilesystem(initialFiles: Record<string, string> = {}) {
  return Volume.fromJSON(initialFiles);
}

export function loadProjectFixture(fs: any, projectType: string, basePath: string) {
  try {
    const fixtureStructure = require(`../../../fixtures/filesystem/${projectType}.json`);
    
    Object.entries(fixtureStructure).forEach(([relativePath, content]) => {
      const fullPath = `${basePath}/${relativePath}`;
      fs.writeFileSync(fullPath, content as string);
    });
    
    return true;
  } catch (error) {
    throw new Error(`Failed to load project fixture: ${projectType}`);
  }
}