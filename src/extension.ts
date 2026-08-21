import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('smartFileCreator.create', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Type: new <folder> <file-name.extension>',
      placeHolder: 'Example: new usecase UserSignInUseCase.cs',
      value: 'new '
    });

    if (!input) return;

    // Parse the input
    const match = input.match(/new\s+(\w+)\s+(.+)/i);
    if (!match) {
      vscode.window.showErrorMessage('Invalid format. Use: new <folder> <file>');
      return;
    }

    const folderName = match[1].toLowerCase();
    const fileName = match[2];

    // Find the folder in the workspace
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('No folder is open in the workspace');
      return;
    }

    try {
      const targetFolder = await findFolder(workspaceFolder.uri.fsPath, folderName);
      if (!targetFolder) {
        vscode.window.showErrorMessage(`Folder '${folderName}' was not found in the project`);
        return;
      }

      // Create the file
      const filePath = path.join(targetFolder, fileName);
      
      // Check whether the file already exists
      if (fs.existsSync(filePath)) {
        vscode.window.showErrorMessage(`File already exists: ${filePath}`);
        return;
      }

      // Create directories if they do not exist
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });

      // Create an empty file or a template-based file
      const template = getTemplate(fileName);
      fs.writeFileSync(filePath, template);

      // Open the file
      const document = await vscode.workspace.openTextDocument(filePath);
      await vscode.window.showTextDocument(document);

      vscode.window.showInformationMessage(`✅ File created: ${filePath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error creating file: ${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

// Search for the folder recursively
async function findFolder(startPath: string, folderName: string): Promise<string | null> {
  const queue = [startPath];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentPath = queue.shift()!;

    if (visited.has(currentPath)) continue;
    visited.add(currentPath);

    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Ignore node_modules, .git, etc.
          if (['.git', 'node_modules', '.vs', 'bin', 'obj'].includes(entry.name)) {
            continue;
          }

          if (entry.name.toLowerCase() === folderName) {
            return path.join(currentPath, entry.name);
          }

          queue.push(path.join(currentPath, entry.name));
        }
      }
    } catch (error) {
      // Ignore permission errors
    }
  }

  return null;
}

// Return a template based on the extension
function getTemplate(fileName: string): string {
  const ext = path.extname(fileName);
  const nameWithoutExt = path.basename(fileName, ext);

  switch (ext.toLowerCase()) {
    case '.cs':
      return getCSharpTemplate(nameWithoutExt);
    case '.ts':
    case '.tsx':
      return getTypeScriptTemplate(nameWithoutExt);
    case '.js':
    case '.jsx':
      return getJavaScriptTemplate(nameWithoutExt);
    case '.py':
      return getPythonTemplate(nameWithoutExt);
    case '.java':
      return getJavaTemplate(nameWithoutExt);
    default:
      return '';
  }
}

function getCSharpTemplate(className: string): string {
  return `namespace MyProject.UseCases
{
    public class ${className}
    {
        public ${className}()
        {
        }

        public void Execute()
        {
            // TODO: Implement
        }
    }
}
`;
}

function getTypeScriptTemplate(className: string): string {
  const pascalCase = className.charAt(0).toUpperCase() + className.slice(1);
  return `export class ${pascalCase} {
  constructor() {}

  execute() {
    // TODO: Implement
  }
}
`;
}

function getJavaScriptTemplate(fileName: string): string {
  return `// TODO: Implement ${fileName}

module.exports = {
};
`;
}

function getPythonTemplate(fileName: string): string {
  const className = fileName.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  return `class ${className}:
    def __init__(self):
        pass

    def execute(self):
        # TODO: Implement
        pass
`;
}

function getJavaTemplate(className: string): string {
  return `public class ${className} {
    public ${className}() {
    }

    public void execute() {
        // TODO: Implement
    }
}
`;
}

export function deactivate() {}
