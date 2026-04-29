# lilydesignsystem.github.io

The public website for the [Lily Design System](https://github.com/LilyDesignSystem) at <https://lilydesignsystem.github.io>.

## What's here

A small static site — plain HTML, CSS, and a sprinkle of vanilla JavaScript — that introduces the project, lists every component, points to the example apps, and helps newcomers get started.

```
lilydesignsystem.github.io/
├── index.html              Landing page
├── about.html              About / philosophy
├── components.html         Searchable catalog of all components
├── examples.html           Links to each framework's example app
├── help.html               Setup guide and FAQ
├── 404.html                Not-found page
├── assets/
│   ├── style.css           Site stylesheet using the Lily palette
│   ├── favicon.svg         Inline gradient favicon
│   ├── components-data.js  Component catalog (generated from components.tsv)
│   └── components.js       Search/filter behavior on components.html
├── .nojekyll               Disables Jekyll on GitHub Pages
└── README.md
```

## Develop

The site is intentionally build-free. Open any `.html` file in a browser. To preview as if served, run any static file server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

GitHub Pages serves the `main` branch automatically because the repository is named `lilydesignsystem.github.io`. Pushing to `main` publishes within a minute or so.

## Update the component catalog

The catalog data in `assets/components-data.js` is generated from the canonical [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv) in the main repo. To regenerate:

```sh
cd ~/git/lilydesignsystem/lily-design-system
{
  echo "// Lily component catalog — generated from components.tsv"
  echo "window.LILY_COMPONENTS = ["
  awk -F'\t' '{
    gsub(/"/, "\\\"", $1); gsub(/"/, "\\\"", $2); gsub(/"/, "\\\"", $3);
    printf "  { name: \"%s\", pascal: \"%s\", description: \"%s\" },\n", $1, $2, $3
  }' components.tsv
  echo "];"
} > ../lilydesignsystem.github.io/assets/components-data.js
```

## License

The site content (text, layout, CSS) is multi-licensed under BSD, MIT, Apache-2.0, GPL-2.0, or GPL-3.0 — same as the rest of Lily. Pick whichever fits your needs.

Contact: Joel Parker Henderson — <joel@joelparkerhenderson.com>.
