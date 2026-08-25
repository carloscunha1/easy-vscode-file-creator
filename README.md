# Smart File Creator

Create files and directories in your workspace with a short `new ...` command.

## Features

- Create files in the project root or in nested paths.
- Create files inside a target folder found anywhere in the project tree.
- Create directories without creating a file.
- Generate starter templates for C#, TypeScript, JavaScript, Python, and Java.

## Current Command Syntax

- `new filename.ext`
- `new folder subdir/file.ext`
- `new folder subdir/`

Note: The syntax is being expanded in the next releases. See the changelog for updates.

## Development

1. Install dependencies:

```bash
npm install
```

2. Build:

```bash
npm run esbuild
```

3. Run extension host:

- Press `F5` in VS Code.

## Packaging

```bash
npm run package
```

## License

MIT
