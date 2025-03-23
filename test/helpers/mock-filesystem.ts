import { Volume, createFsFromVolume } from 'memfs';
import * as path from 'path';

export interface MockFileSystemOptions {
  initialStructure?: Record<string, string>;
}

export class MockFileSystem {
  // Fix 1: Use ReturnType to properly type the volume instance
  private vol: ReturnType<typeof Volume.fromJSON>;
  private fs: ReturnType<typeof createFsFromVolume>;
  
  constructor(options: MockFileSystemOptions = {}) {
    this.vol = Volume.fromJSON(options.initialStructure || {});
    this.fs = createFsFromVolume(this.vol);
  }

  readFile(filepath: string, options?: { encoding?: BufferEncoding }): Promise<Buffer | string> {
    return new Promise((resolve, reject) => {
      // Fix 2: Use properly typed options for memfs
      this.fs.readFile(filepath, options as any, (err, data) => {
        if (err) reject(err);
        // Fix 3: Add null check for data
        else resolve(data || Buffer.from([]));
      });
    });
  }

  writeFile(filepath: string, data: string | Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(filepath, data, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  mkdir(dirPath: string, options?: { recursive?: boolean }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.mkdir(dirPath, options || {}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  exists(filepath: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.fs.exists(filepath, (exists) => {
        resolve(exists);
      });
    });
  }

  setupProject(projectPath: string, projectType: string): Promise<void> {
    const structure: Record<string, string> = {};
    
    // Common structure
    structure[path.join(projectPath, 'package.json')] = JSON.stringify({
      name: `test-${projectType.toLowerCase()}`,
      version: '1.0.0'
    });
    
    // Project-specific structure
    if (projectType === 'Next.js') {
      structure[path.join(projectPath, 'pages/index.ts')] = 'export default function Home() { return <div>Home</div> }';
      structure[path.join(projectPath, 'tsconfig.json')] = JSON.stringify({ compilerOptions: { target: 'ESNext' }});
      structure[path.join(projectPath, '.nvmrc')] = '18.16.0';
    } else if (projectType === 'Express') {
      structure[path.join(projectPath, 'src/server.ts')] = 'import express from "express"; const app = express();';
      structure[path.join(projectPath, 'tsconfig.json')] = JSON.stringify({ compilerOptions: { target: 'ES2020' }});
      structure[path.join(projectPath, '.nvmrc')] = '16.20.0';
    }
    
    // Create all files
    return Promise.all(
      Object.entries(structure).map(([filepath, content]) => {
        const dir = path.dirname(filepath);
        return this.mkdir(dir, { recursive: true })
          .then(() => this.writeFile(filepath, content))
          .catch(() => this.writeFile(filepath, content));
      })
    ).then(() => {});
  }
  
  reset(): void {
    this.vol = Volume.fromJSON({});
    this.fs = createFsFromVolume(this.vol);
  }
}