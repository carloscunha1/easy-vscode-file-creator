export type CreateTargetKind = 'file' | 'directory';

export interface ParsedCreateCommand {
  folderHint?: string;
  relativePath: string;
  kind: CreateTargetKind;
}

export interface DirectoryEntryInfo {
  name: string;
  fullPath: string;
}

export interface DirectoryCandidate {
  name: string;
  fullPath: string;
  score: number;
}

export type ResolveReason = 'exact' | 'auto-similar';

export interface ResolveSuccess {
  status: 'resolved';
  fullPath: string;
  reason: ResolveReason;
}

export interface ResolveSelect {
  status: 'select';
  options: DirectoryCandidate[];
  reason: 'multiple-exact' | 'similar';
}

export interface ResolveNotFound {
  status: 'not-found';
  suggestions: DirectoryCandidate[];
}

export type ResolveFolderResult = ResolveSuccess | ResolveSelect | ResolveNotFound;
