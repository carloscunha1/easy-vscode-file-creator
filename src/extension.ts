import * as path from 'path';
import * as vscode from 'vscode';
import { parseCreateCommand } from './core/commandParser';
import { createTarget } from './core/fileCreator';
import { resolveFolderByHint } from './core/folderResolver';
import { ResolveFolderResult } from './core/types';
import { pickWorkspaceRoot } from './core/workspaceResolver';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('smartFileCreator.create', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Type a new command to create a file or directory.',
      placeHolder: 'Examples: new User.cs | new usecase handlers/User.cs | new contracts/',
      value: 'new '
    });

    if (!input) {
      return;
    }

    try {
      const parsed = parseCreateCommand(input);
      const workspaceRoot = await pickWorkspaceRoot();

      const targetBasePath = parsed.folderHint
        ? await resolveTargetBasePath(workspaceRoot, parsed.folderHint)
        : workspaceRoot;

      const result = createTarget(targetBasePath, parsed, workspaceRoot);

      if (result.kind === 'file') {
        const document = await vscode.workspace.openTextDocument(result.createdPath);
        await vscode.window.showTextDocument(document);
      }

      const relativeCreatedPath = path.relative(workspaceRoot, result.createdPath);
      const kindLabel = result.kind === 'file' ? 'File' : 'Directory';
      vscode.window.showInformationMessage(`${kindLabel} created: ${relativeCreatedPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(message);
    }
  });

  context.subscriptions.push(disposable);
}

async function resolveTargetBasePath(workspaceRoot: string, folderHint: string): Promise<string> {
  const result = resolveFolderByHint(workspaceRoot, folderHint);

  if (result.status === 'resolved') {
    if (result.reason === 'auto-similar') {
      const relativePath = path.relative(workspaceRoot, result.fullPath);
      vscode.window.showInformationMessage(`Folder auto-selected by similarity: ${relativePath}`);
    }
    return result.fullPath;
  }

  if (result.status === 'select') {
    const selected = await selectFolderCandidate(result, workspaceRoot, folderHint);
    if (!selected) {
      throw new Error('Folder selection was canceled.');
    }
    return selected;
  }

  const suggestionText = result.suggestions
    .slice(0, 3)
    .map((item) => `${item.name} (${Math.round(item.score * 100)}%)`)
    .join(', ');

  const suffix = suggestionText ? ` Suggestions: ${suggestionText}.` : '';
  throw new Error(`Folder not found: ${folderHint}.${suffix}`);
}

async function selectFolderCandidate(
  result: Extract<ResolveFolderResult, { status: 'select' }>,
  workspaceRoot: string,
  folderHint: string
): Promise<string | undefined> {
  const placeHolder =
    result.reason === 'multiple-exact'
      ? `Multiple folders named ${folderHint} were found. Select one.`
      : `No exact match for ${folderHint}. Select the closest folder.`;

  const selected = await vscode.window.showQuickPick(
    result.options.map((option) => ({
      label: option.name,
      description: `${Math.round(option.score * 100)}% match`,
      detail: path.relative(workspaceRoot, option.fullPath),
      fullPath: option.fullPath
    })),
    {
      placeHolder
    }
  );

  return selected?.fullPath;
}

export function deactivate() {}
