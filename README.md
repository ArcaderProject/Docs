# Docs

Documentation for the Arcader project, built with [Astro Starlight](https://starlight.astro.build/).

## Development

```sh
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:4321
npm run build    # build the static site into ./dist
npm run preview  # preview the production build locally
```

## Structure

| Path                    | Purpose                                              |
|-------------------------|------------------------------------------------------|
| `src/content/docs/`     | The documentation pages (Markdown / MDX).            |
| `src/styles/retro.css`  | Retro theme: pixel font for headings, red accent.    |
| `src/assets/`           | Images processed by Astro (e.g. the logo).           |
| `public/assets/`        | Static files served as-is (images, font, 3D models). |
| `astro.config.mjs`      | Site config, sidebar navigation and theme.           |
