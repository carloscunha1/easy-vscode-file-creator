import * as fs from 'fs';
import * as path from 'path';
import {
  DirectoryCandidate,
  DirectoryEntryInfo,
  ResolveFolderResult,
  ResolveSelect,
  ResolveSuccess
} from './types';

const IGNORED_DIRECTORIES = new Set(['.git', 'node_modules', '.vs', 'bin', 'obj', 'dist', 'out']);
const AUTO_MATCH_THRESHOLD = 0.97;
const SELECT_MATCH_THRESHOLD = 0.8;
const MAX_SUGGESTIONS = 5;

export function resolveFolderByHint(workspaceRoot: string, folderHint: string): ResolveFolderResult {
  const allDirectories = scanDirectories(workspaceRoot);
  const normalizedHint = normalizeText(folderHint);

  const exactMatches = allDirectories.filter((entry) => normalizeText(entry.name) === normalizedHint);
  if (exactMatches.length === 1) {
    const success: ResolveSuccess = {
      status: 'resolved',
      fullPath: exactMatches[0].fullPath,
      reason: 'exact'
    };
    return success;
  }

  if (exactMatches.length > 1) {
    const select: ResolveSelect = {
      status: 'select',
      reason: 'multiple-exact',
      options: exactMatches.map((entry) => ({ name: entry.name, fullPath: entry.fullPath, score: 1 }))
    };
    return select;
  }

  const ranked = rankBySimilarity(folderHint, allDirectories);
  if (ranked.length === 0) {
    return { status: 'not-found', suggestions: [] };
  }

  if (ranked[0].score >= AUTO_MATCH_THRESHOLD) {
    return {
      status: 'resolved',
      fullPath: ranked[0].fullPath,
      reason: 'auto-similar'
    };
  }

  const options = ranked.slice(0, MAX_SUGGESTIONS);
  if (options[0].score >= SELECT_MATCH_THRESHOLD) {
    return {
      status: 'select',
      reason: 'similar',
      options
    };
  }

  return {
    status: 'not-found',
    suggestions: options
  };
}

function scanDirectories(startPath: string): DirectoryEntryInfo[] {
  const queue = [startPath];
  const visited = new Set<string>();
  const directories: DirectoryEntryInfo[] = [];

  while (queue.length > 0) {
    const currentPath = queue.shift();
    if (!currentPath || visited.has(currentPath)) {
      continue;
    }

    visited.add(currentPath);

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(currentPath, entry.name);
      directories.push({ name: entry.name, fullPath });
      queue.push(fullPath);
    }
  }

  return directories;
}

function rankBySimilarity(folderHint: string, entries: DirectoryEntryInfo[]): DirectoryCandidate[] {
  const normalizedHint = normalizeText(folderHint);

  const ranked = entries.map((entry) => ({
    name: entry.name,
    fullPath: entry.fullPath,
    score: similarity(normalizedHint, normalizeText(entry.name))
  }));

  return ranked.sort((a, b) => b.score - a.score);
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function similarity(left: string, right: string): number {
  if (left === right) {
    return 1;
  }

  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) {
    return 1;
  }

  const distance = levenshteinDistance(left, right);
  return 1 - distance / maxLength;
}

function levenshteinDistance(left: string, right: string): number {
  const rows = left.length + 1;
  const cols = right.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let row = 0; row < rows; row++) {
    matrix[row][0] = row;
  }

  for (let col = 0; col < cols; col++) {
    matrix[0][col] = col;
  }

  for (let row = 1; row < rows; row++) {
    for (let col = 1; col < cols; col++) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}
