# How to Run Smart File Creator

This guide covers local development, manual testing, and packaging.

## Prerequisites

- Node.js 18+
- npm 9+
- VS Code 1.80+

## Install and Build

```bash
npm install
npm run esbuild
```

## Run in Development Host

1. Open the repository in VS Code.
2. Press `F5`.
3. In the Extension Development Host window, open a workspace folder.

## Test Command Syntax

Press `Ctrl+Shift+N` (or `Cmd+Shift+N` on macOS) and run examples:

```text
new UserSignInUseCase.cs
new application/usecases/CreateUserUseCase.cs
new usecase handlers/CreateUserUseCase.cs
new contracts/
new usecase contracts/
```

Expected behavior:

- Files are created and opened automatically.
- Directories are created without opening a file.
- Target folder lookup is case-insensitive.
- If no exact folder exists, similar folders may be auto-selected or suggested.

## Package VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

## Troubleshooting

### Command does not start

- Ensure the extension is active in the Extension Development Host.
- Open the command palette and run Smart File Creator command manually.

### Folder not found

- Verify the folder exists in the selected workspace.
- Try a slightly different folder name to trigger similarity suggestions.

### Build errors

- Delete `node_modules` and reinstall dependencies.
- Re-run `npm run esbuild`.
