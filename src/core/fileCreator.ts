import * as fs from 'fs';
import * as path from 'path';
import { ParsedCreateCommand } from './types';
import { getTemplate } from './templateResolver';

export interface CreateResult {
  createdPath: string;
  kind: 'file' | 'directory';
}

export function createTarget(basePath: string, command: ParsedCreateCommand, workspaceRoot: string): CreateResult {
  const createdPath = path.join(basePath, command.relativePath);

  if (fs.existsSync(createdPath)) {
    throw new Error(`Target already exists: ${createdPath}`);
  }

  if (command.kind === 'directory') {
    fs.mkdirSync(createdPath, { recursive: true });
    return {
      createdPath,
      kind: 'directory'
    };
  }

  fs.mkdirSync(path.dirname(createdPath), { recursive: true });
  const template = getTemplate(path.basename(createdPath), path.dirname(createdPath), workspaceRoot);
  fs.writeFileSync(createdPath, template, { encoding: 'utf8' });

  return {
    createdPath,
    kind: 'file'
  };
}
