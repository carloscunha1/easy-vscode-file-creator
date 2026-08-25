# Smart File Creator

Create files and directories in your workspace using a single `new` command.

## Features

- Create files in the workspace root.
- Create files inside nested subdirectories.
- Create files inside a target folder found anywhere in the project.
- Create directories without creating a file.
- Auto-generate templates for C#, TypeScript, JavaScript, Python, and Java.

## Command Syntax

- `new filename.ext`
- `new subdir/filename.ext`
- `new targetFolder subdir/filename.ext`
- `new directory/`
- `new targetFolder subdir/`

## Quick Start

1. Press `Ctrl+Shift+N` on Windows/Linux or `Cmd+Shift+N` on macOS.
2. Type one of the supported `new` commands.
3. Press Enter.

## Folder Resolution

- Exact folder match is case-insensitive.
- If no exact folder is found, similar folder names are evaluated.
- Very high similarity can be auto-selected.
- Otherwise, the extension asks you to choose from suggested folders.

## C# Namespace Behavior

- The extension first tries to reuse the dominant namespace from `.cs` files in the destination directory.
- If none exists, it generates a namespace from the workspace name and the target path.

## Development

```bash
npm install
npm run esbuild
```

Run the extension in an Extension Development Host using `F5`.

## Documentation

See [docs/how-to-run.md](docs/how-to-run.md) for local setup and packaging steps.

## License

```bash
npm run package
```

## License

MIT
