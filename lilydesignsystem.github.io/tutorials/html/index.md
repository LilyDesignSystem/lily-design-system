# Lily tutorial for HTML CSS JS

This tutorial walks through using Lily's HTML headless components in a plain
static site — no framework, no build step.

## What you'll build

A small page with a Lily Button, a Lily Alert, and a Lily Form composition that
toggles the alert when submitted.

## Prerequisites

- A text editor.
- Any modern browser.
- Optional: Python or Node for serving the file locally.

## Step 1 — Get the headless components

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system-html-headless
```

Each component lives in its own directory under `components/<component-name>/`
and contains a single `.html` snippet. There is no JavaScript bundle to import
and no CSS to load — that is the headless contract.

## Step 2 — Create a page

Make `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Lily app</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
    <h1>Hello, Lily.</h1>

    <div role="alert" class="alert" id="status" hidden>
      Saved successfully.
    </div>

    <form class="form" id="signup">
      <label class="field">
        <span class="field-label">Email</span>
        <input class="text-input" type="email" name="email" required>
      </label>
      <button class="button" type="submit">Save</button>
    </form>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

The classes (`alert`, `form`, `field`, `text-input`, `button`) are the
kebab-case root classes Lily uses on every component.

## Step 3 — Add styles

Lily ships zero CSS. Write your own in `styles.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-text: #111827;
  --color-border: #d1d5db;
}
body { font: 16px/1.5 system-ui, sans-serif; color: var(--color-text); }
main { max-width: 32rem; margin: 4rem auto; padding: 0 1rem; }

.alert {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: #ecfdf5;
  color: #065f46;
  margin-bottom: 1rem;
}

.form { display: grid; gap: 1rem; }
.field { display: grid; gap: 0.25rem; }
.field-label { font-weight: 600; }
.text-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
}

.button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: #fff;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;
}
.button:hover { filter: brightness(1.05); }
```

## Step 4 — Wire up behavior

Lily headless ships markup and ARIA. Behavior is yours. Create `app.js`:

```js
const form = document.getElementById("signup");
const status = document.getElementById("status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.hidden = false;
  form.reset();
});
```

## Step 5 — Run it

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Type an email and click **Save** — the alert
appears.

## What you got for free

- `<button class="button" type="submit">` — proper button semantics, keyboard
  accessibility, a focus ring you control via CSS.
- `<input type="email" required>` — built-in validation and error semantics.
- `role="alert"` on the status region — screen readers announce updates.
- `<label>` wrapping the input — every keystroke is associated with the label.

## Where to go next

- Browse the [component catalog](../../components/) to see every available
  pattern.
- Read the [Help guide](../../help/) for setup details across the other
  frameworks.
- Look at the HTML examples repo for full demo pages with styled markup you can
  copy.
