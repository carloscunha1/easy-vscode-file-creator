import * as path from 'path';
import { ParsedCreateCommand } from './types';

const NEW_PREFIX = /^new\s+/i;

export function parseCreateCommand(input: string): ParsedCreateCommand {
  const value = input.trim();
  if (!NEW_PREFIX.test(value)) {
    throw new Error('Invalid format. Command must start with "new".');
  }

  const content = value.replace(NEW_PREFIX, '').trim();
  if (!content) {
    throw new Error('Invalid format. Missing command arguments.');
  }

  const tokens = content.split(/\s+/);
  if (tokens.length === 1) {
    const token = tokens[0];
    return parseRootTarget(token);
  }

  const folderHint = tokens[0];
  const rawTarget = content.slice(folderHint.length).trim();
  if (!rawTarget) {
    throw new Error('Invalid format. Missing target path after folder name.');
  }

  const isDirectory = rawTarget.endsWith('/');
  const relativePath = normalizeRelativePath(isDirectory ? stripTrailingSlashes(rawTarget) : rawTarget);

  return {
    folderHint,
    relativePath,
    kind: isDirectory ? 'directory' : 'file'
  };
}

function parseRootTarget(token: string): ParsedCreateCommand {
  const isDirectory = token.endsWith('/');
  const relativePath = normalizeRelativePath(isDirectory ? stripTrailingSlashes(token) : token);

  return {
    relativePath,
    kind: isDirectory ? 'directory' : 'file'
  };
}

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/g, '');
}

function normalizeRelativePath(value: string): string {
  const normalizedValue = value.replace(/\\/g, '/').trim();
  if (!normalizedValue) {
    throw new Error('Invalid format. Target path cannot be empty.');
  }

  if (normalizedValue.startsWith('/') || path.isAbsolute(normalizedValue)) {
    throw new Error('Invalid target path. Use a relative path inside the workspace.');
  }

  const parts = normalizedValue.split('/').filter(Boolean);
  if (parts.length === 0) {
    throw new Error('Invalid target path.');
  }

  if (parts.some((part) => part === '.' || part === '..')) {
    throw new Error('Invalid target path. Relative traversal is not allowed.');
  }

  return path.join(...parts);
}
