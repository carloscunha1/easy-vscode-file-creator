# How to Run Smart File Creator

## Prerequisites

- Node.js 18+
- npm 9+
- VS Code 1.80+

## Install Dependencies

```bash
npm install
```

## Build

```bash
npm run esbuild
```

## Run in Extension Development Host

1. Open the project in VS Code.
2. Press `F5`.
3. In the Extension Development Host window, open a workspace folder.
4. Press `Ctrl+Shift+N` (or `Cmd+Shift+N` on macOS).

## Package a VSIX

```bash
npm run package
```

The command generates a `.vsix` file that can be installed with "Extensions: Install from VSIX".

## Troubleshooting

- If build fails, run `npm install` again.
- If command does not appear, reload the extension host window.
- If output looks stale, rebuild with `npm run esbuild` and restart debug session.
