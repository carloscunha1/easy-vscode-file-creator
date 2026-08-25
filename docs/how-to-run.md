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
npm run package
```

This command generates a `.vsix` file in the project root.

## Install Extension in VS Code (Without Marketplace)

### Option 1: Install from VS Code UI

1. Open VS Code.
2. Go to Extensions.
3. Open the Extensions menu (three dots).
4. Select Install from VSIX....
5. Select the generated `.vsix` file.
6. Reload VS Code if prompted.

### Option 2: Install from Terminal

Run this command from the project root, replacing the file name with your generated package:

```bash
code --install-extension smart-file-creator-0.0.1.vsix
```

After installation, the extension is available in your normal VS Code session and does not require running with `F5`.

## Update or Reinstall

1. Rebuild and repackage the extension.
2. Install the new `.vsix` again using one of the options above.
3. Reload VS Code.

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
