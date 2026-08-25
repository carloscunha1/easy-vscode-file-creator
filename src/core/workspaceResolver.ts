import * as vscode from 'vscode';

export async function pickWorkspaceRoot(): Promise<string> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error('No folder is open in the workspace.');
  }

  if (folders.length === 1) {
    return folders[0].uri.fsPath;
  }

  const selected = await vscode.window.showQuickPick(
    folders.map((folder) => ({
      label: folder.name,
      detail: folder.uri.fsPath,
      fsPath: folder.uri.fsPath
    })),
    {
      placeHolder: 'Select the workspace folder where the file or directory should be created.'
    }
  );

  if (!selected) {
    throw new Error('Workspace folder selection was canceled.');
  }

  return selected.fsPath;
}
