#!/usr/bin/env node
import fs from "node:fs";
import fss from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import {
  blue,
  bold,
  cyan,
  gray,
  lightBlue,
  lightRed,
  magenta,
  red,
  reset,
} from "kolorist";

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
 * @param {string} path
 * @param {(initial: string) => string} fn
 */
async function update(path, fn) {
  if (!fs.existsSync(path)) return;
  const file = await fss.readFile(path, { encoding: "utf-8" });
  await fss.writeFile(path, fn(file));
}

const templates = [
  {
    name: "gleam-web-app",
    description: "a basic gleam web app",
    color: magenta,
  },
  {
    name: "glare-app",
    description: "template using Glare (SolidJS)",
    color: cyan,
  },
  {
    name: "lustre-app",
    description: "template using Lustre (ReactJS)",
    color: blue,
  },
];

async function main() {
  let targetDir = "sample_project";

  let res;
  try {
    res = await prompts(
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
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

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

  await Promise.all(
    [
      "package.json",
      "index.html",
      "gleam.toml",
      "tsconfig.json",
    ].map(
      (p) =>
        update(path.join(root, p), (file) => {
          return file.replaceAll("{{NAME}}", name);
        }),
    ),
  );

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
