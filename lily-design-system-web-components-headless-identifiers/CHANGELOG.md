# Changelog — @lilydesignsystem/web-components-headless-identifiers

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).

## 0.4.0 — 2026-11-23

- **Added:** `validateNationalIdentifier` and the per-identifier check-digit validators (documented algorithms only), returning `{ valid }` or `{ valid: false, reason }`; a non-string is a `TypeError`. Pickers: none.

## 0.3.0 — 2026-11-18

- **Changed:** an `id` given to an input component (every identifier input) moves to that control instead of being copied, so there is one element
  with the id and a `<label for>` or `aria-labelledby` reaches the control. Code that looked the custom element up by
  that id now finds the control (P38-T3).

## 0.2.0 — 2026-11-18

- Twelve more national identifier types, 24 components (188 in all, 94 types): Peru's Documento Nacional de
  Identidad, the Dominican Republic's Cédula de Identidad y Electoral, Costa Rica's Cédula de Identidad, Guatemala's
  Código Único de Identificación, Mauritius's National Identity Card number, the Ghana Card PIN, Ethiopia's Fayda
  Identification Number, Sri Lanka's and Bangladesh's National Identity Card numbers, Kazakhstan's Individual
  Identification Number, Uzbekistan's JShShIR and the Emirates ID number. Each documents its format and, where one is
  published, its check-digit algorithm; where none is published the docs say so.

## 0.1.0 — 2026-11-18

- First release: the 164 national personal identifier components of the Lily Design System catalog for Web Components, an
  `-input` and a `-view` for each of 82 identifier types across more than 50 countries, moved here unchanged from
  `@lilydesignsystem/web-components-headless` 0.11.0 (spec/headless-identifiers). No dependency on `@lilydesignsystem/web-components-headless`.
