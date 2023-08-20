# Lustre + Gleam + Typescript

[Repository](https://github.com/Endercheif/vite-gleam)

## Template Tour

```
├── .gitignore      // list of files/folders hidden by git
├── assets          // location of static/nonjs files to be (images, css). can be imported/compiled
│   └── main.css
├── public          // location of static files served on the root of the site (ex: `example.com/image.svg`)
│   └── gleam.svg
│   └── vite.svg
├── gleam.toml      // no need to edit
├── index.html      // modify as you wish, keep script tag
├── package.json    // reference node packages and used to run commands
├── README.md
├── src             // location of your actual program, do stuff here
│   ├── main.js     // entry point referenced by index.html
│   └── app.gleam
├── jsconfig.json   // settings for typescript
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
