// Category id -> display label (plan P6-T5's /components category
// filter). Kept as its own Eleventy global-data file (rather than
// folded into components.js) so templates can render the dropdown's
// option list without walking the component array to find every id
// in use. Source: bin/generate-component-categories' CATEGORY_LABEL,
// copied by hand since Eleventy's ESM data files can't require() the
// CommonJS generator script directly — keep the two in sync if the
// category set changes.
const CATEGORY_LABEL = {
  national: "National identifiers",
  forms: "Form controls",
  buttons: "Buttons",
  links: "Links",
  lists: "Lists",
  tables: "Tables",
  navigation: "Navigation & structure",
  overlays: "Overlays & dialogs",
  pickers: "Pickers & ratings",
  media: "Media & figures",
  "data-viz": "Data visualization",
  content: "Content & other",
};

export default CATEGORY_LABEL;
