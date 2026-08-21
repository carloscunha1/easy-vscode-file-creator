# 🚀 How to Run - CommandFileCreator

A complete guide to install, build, and test the extension.

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **VS Code** 1.80+ ([Download](https://code.visualstudio.com/))
- **Git** (optional, for cloning)

Check your versions:
```bash
node --version
npm --version
```

---

## 📥 Step 1: Clone or Download the Repository

### Option A: Clone with Git
```bash
git clone https://github.com/yourusername/CommandFileCreator.git
cd CommandFileCreator
```

### Option B: Download as ZIP
1. Click **Code → Download ZIP** on GitHub
2. Extract the ZIP file
3. Open the folder in terminal

---

## 📦 Step 2: Install Dependencies

Make sure you're in the project root (where `package.json` is):

```bash
npm install
```

This will download all required packages (~200MB).

---

## 🔨 Step 3: Build the Extension

Compile TypeScript to JavaScript:

```bash
npm run esbuild
```

You should see a `dist/` folder created with `extension.js` inside.

---

## ✅ Step 4: Test Locally (Development Mode)

### Option A: VS Code UI
1. Open the project in VS Code: `code .`
2. Press **F5** (or go to Run → Start Debugging)
3. A new VS Code window opens with the extension active

### Option B: Command Line
```bash
code .
# Then press F5
```

---

## 🧪 Step 5: Test the Extension

In the **new VS Code window** that opened:

1. **Open any project folder** (the extension needs a workspace)
2. **Press `Ctrl+Shift+N`** (Windows/Linux) or **`Cmd+Shift+N`** (Mac)
3. Type a command:
   ```
   new usecase UserSignInUseCase.cs
   ```
4. Press **Enter**

### Expected Result ✅
- File created in the `usecase` folder
- File opens automatically
- Message: "✅ File created: ..."

### Troubleshooting
- Press `Ctrl+Shift+J` to open the console and check for errors
- Make sure the folder `usecase` exists in your project
- Try with a different folder name

---

## 📦 Step 6: Package the Extension (Optional)

If you want to **install it permanently** on your VS Code:

### Install the Packager
```bash
npm install -g @vscode/vsce
```

### Create the Package
```bash
vsce package
```

This creates a `.vsix` file (the extension installer).

### Install the Extension
1. In VS Code: **Extensions → ... → Install from VSIX**
2. Select the `.vsix` file
3. Reload VS Code

Now the extension is **always available**, not just in debug mode!

---

## 📝 Development Workflow

### Watch Mode (Auto-recompile on changes)
While developing, use watch mode to recompile automatically:

```bash
npm run esbuild-watch
```

Changes to `src/extension.ts` will recompile automatically.

### Reload the Extension
After making changes:
1. In the debug window, press `Ctrl+Shift+F5` to reload
2. Or press **Ctrl+R** in the extension window

---

## 🗂️ Project Structure

```
CommandFileCreator/
├── src/
│   └── extension.ts          # Main extension code
├── dist/                      # Generated (don't commit)
│   └── extension.js          # Compiled JavaScript
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── README.md                 # Main documentation
└── .gitignore               # Git ignore rules
```

---

## 🐛 Common Issues

### Issue: "npm: command not found"
**Solution:** Install [Node.js](https://nodejs.org/)

### Issue: "Cannot find module 'vscode'"
**Solution:** Run `npm install` in the project root

### Issue: Extension doesn't appear in debug window
**Solution:**
1. Close all VS Code windows
2. Delete `node_modules` folder
3. Delete `dist` folder
4. Run `npm install && npm run esbuild`
5. Press `F5` again

### Issue: "Folder not found"
**Solution:**
- Make sure the folder exists in your project
- Folder name is case-insensitive, but must match
- Try a different folder to test

### Issue: Command doesn't trigger
**Solution:**
1. Check if extension activated: Extensions panel → Smart File Creator
2. Press `Ctrl+Shift+P` and search for "Smart File Creator"
3. Check the console for errors (`Ctrl+Shift+J`)

---

## 📚 Next Steps

- Read [README.md](README.md) for features and examples
- Customize templates in `src/extension.ts`
- Add more file types (Go, Rust, etc.)
- Publish to VS Code Marketplace

---

## 🔗 Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [esbuild Documentation](https://esbuild.github.io/)

---

## 💡 Tips

- Use `Ctrl+Shift+P` → "Developer: Toggle Developer Tools" for debugging
- Check `.vscode/launch.json` for debug configuration
- The extension runs in a separate process (doesn't affect main VS Code)

---

**Need help?** Open an issue on GitHub! 🎉