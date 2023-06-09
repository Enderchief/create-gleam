#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { bold, cyan, gray, red, reset } from "kolorist";

/**
 * @param {fs.PathLike} path
 */
function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

/**
 * @param {string} dir
 */
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 */
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

/**
 * @param {string} src
 * @param {string} dest
 */
function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * @param {fs.PathOrFileDescriptor} path
 * @param {(initial: string) => string} fn
 */
function update(path, fn) {
    const file = fs.readFileSync(path, {encoding: 'utf-8'});
    fs.writeFileSync(path, fn(file))
}

const templates = [
  {
    name: "gleam-web-app",
    description: "a basic gleam web app",
    color: cyan,
  },
];

async function main() {
  let targetDir = "sample_project";

  const res = await prompts(
    [
      {
        type: "text",
        name: "projectName",
        message: reset("Project name:"),
        onState(state) {
          targetDir = state.value || "sample_project";
        },
        initial: "sample_project",
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
        name: "overwrite",
        message: () =>
          (targetDir === "."
            ? "Current directory"
            : `Target directory "${targetDir}"`) +
          ` is not empty. Remove existing files and continue?`,
      },
      {
        type: (_, { overwrite }) => {
          if (overwrite === false) {
            throw new Error(red("✖") + " Operation cancelled");
          }
          return null;
        },
        name: "overwriteChecker",
      },
      {
        type: "select",
        name: "template",
        message: reset("Select a template to scaffold your project"),
        choices: templates.map((template) => ({
          title: template.color(template.name),
          description: template.description,
          value: template.name,
        })),
      },
    ],
    {
      onCancel() {
        throw new Error(red("✖") + " Operation cancelled");
      },
    },
  );

  const root = path.join(process.cwd(), targetDir);

  /** @type { {projectName: string, overwrite: boolean, template: string} } */
  const { projectName, overwrite, template } = res;
  const name = projectName.toLowerCase().replaceAll("-", "_");

  if (overwrite) {
    emptyDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const templateDir = path.resolve(
    path.join(import.meta.url.slice(7), "../templates/"),
    template,
  );

  const files = fs.readdirSync(templateDir);
  for (const file of files) {
    const targetPath = path.join(root, file);
    copy(path.join(templateDir, file), targetPath);
  }

  update(path.join(root, 'package.json'), file => {
    let f = JSON.parse(file);
    f.name = name;
    return JSON.stringify(f, null, 2);
  })

  update(path.join(root, 'index.html'), file => {
    return file.replaceAll("{{NAME}}", name);
  })
  
  update(path.join(root, 'gleam.toml'), file => {
    return file.replaceAll("{{NAME}}", name);
  })

  update(path.join(root, 'tsconfig.json'), file => {
    let f = JSON.parse(file);
    f.rootDirs[1] = `build/dev/javascript/${name}`;
    return JSON.stringify(f, null, 2);
  })


  console.log(bold(`Project scaffolded at ${root}`));
  console.log(
    `Run:
    cd ${root.replace(process.cwd(), ".")}
    npm install ${gray("# or pnpm install / yarn")}
    npm run dev ${gray("# or pnpm dev / yarn dev")}
`,
  );
}

main();
