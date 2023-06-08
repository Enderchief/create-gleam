# Gleam + Typescript, Web Template

[Repository](https://github.com/Endercheif/vite-gleam)

## Template Tour

```
├── .gitignore      // list of files/folders hidden by git
├── assets          // location of static/nonjs files (images, css)
│   └── main.css
├── gleam.toml      // no need to edit
├── index.html      // modify as you wish, keep script tag
├── package.json    // reference node packages and used to run commands
├── README.md
├── src             // location of your actual program, do stuff here
│   ├── entry.ts    // entry point referenced by index.html
│   ├── ffi.ts
│   ├── global.d.ts // allows typescript to import from `.gleam`
│   └── main.gleam
├── tsconfig.json   // settings for typescript
└── vite.config.js  // settings for vite
```

## Quick start

Install depenencies

```sh
npm install
# or `yarn install` / `pnpm install`
```

Run development server and make changes in `/src`

```sh
npm run dev
```

Build for production

```sh
npm run build
npm run preview     # preview output
```

Ship and serve `/dist`
