import * as fs from 'fs';
import * as path from 'path';

export function getTemplate(fileName: string, targetDirectory: string, workspaceRoot: string): string {
  const extension = path.extname(fileName).toLowerCase();
  const nameWithoutExtension = path.basename(fileName, extension);

  switch (extension) {
    case '.cs':
      return getCSharpTemplate(nameWithoutExtension, targetDirectory, workspaceRoot);
    case '.ts':
    case '.tsx':
      return getTypeScriptTemplate(nameWithoutExtension);
    case '.js':
    case '.jsx':
      return getJavaScriptTemplate(nameWithoutExtension);
    case '.py':
      return getPythonTemplate(nameWithoutExtension);
    case '.java':
      return getJavaTemplate(nameWithoutExtension);
    default:
      return '';
  }
}

function getCSharpTemplate(classNameSource: string, targetDirectory: string, workspaceRoot: string): string {
  const className = toPascalCaseIdentifier(classNameSource, 'NewClass');
  const namespaceFromDirectory = getDominantNamespaceFromDirectory(targetDirectory);
  const namespace = namespaceFromDirectory ?? buildNamespaceFromPath(workspaceRoot, targetDirectory);

  return `namespace ${namespace}
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

function getTypeScriptTemplate(classNameSource: string): string {
  const className = toPascalCaseIdentifier(classNameSource, 'NewClass');
  return `export class ${className} {
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
  const className = toPascalCaseIdentifier(fileName, 'NewClass');
  return `class ${className}:
    def __init__(self):
        pass

    def execute(self):
        # TODO: Implement
        pass
`;
}

function getJavaTemplate(classNameSource: string): string {
  const className = toPascalCaseIdentifier(classNameSource, 'NewClass');
  return `public class ${className} {
    public ${className}() {
    }

    public void execute() {
        // TODO: Implement
    }
}
`;
}

function getDominantNamespaceFromDirectory(targetDirectory: string): string | undefined {
  let entries: string[];
  try {
    entries = fs.readdirSync(targetDirectory);
  } catch {
    return undefined;
  }

  const namespaceCount = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.toLowerCase().endsWith('.cs')) {
      continue;
    }

    const fullPath = path.join(targetDirectory, entry);
    let content: string;
    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch {
      continue;
    }

    const match = content.match(/^\s*namespace\s+([A-Za-z_][A-Za-z0-9_.]*)/m);
    if (!match) {
      continue;
    }

    const namespaceValue = match[1];
    namespaceCount.set(namespaceValue, (namespaceCount.get(namespaceValue) ?? 0) + 1);
  }

  let bestNamespace: string | undefined;
  let bestCount = 0;
  for (const [namespaceValue, count] of namespaceCount.entries()) {
    if (count > bestCount) {
      bestNamespace = namespaceValue;
      bestCount = count;
    }
  }

  return bestNamespace;
}

function buildNamespaceFromPath(workspaceRoot: string, targetDirectory: string): string {
  const workspaceName = path.basename(workspaceRoot);
  const rootSegment = toPascalCaseIdentifier(workspaceName, 'Project');

  const relative = path.relative(workspaceRoot, targetDirectory);
  const segments = relative
    .split(path.sep)
    .filter(Boolean)
    .map((segment) => toPascalCaseIdentifier(segment, 'Folder'));

  return [rootSegment, ...segments].join('.');
}

function toPascalCaseIdentifier(source: string, fallback: string): string {
  const cleaned = source
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_]+/g, ' ')
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return fallback;
  }

  const pascal = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  if (!pascal) {
    return fallback;
  }

  if (/^[0-9]/.test(pascal)) {
    return `_${pascal}`;
  }

  return pascal;
}
