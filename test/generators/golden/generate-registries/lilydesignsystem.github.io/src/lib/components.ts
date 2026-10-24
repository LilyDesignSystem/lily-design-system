// Lily component catalog — generated from components.tsv
// Components across HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks headless

export type LilyComponent = {
  name: string;
  pascal: string;
  description: string;
  /** Maturity: see the rubric in spec/components. */
  status: 'stable' | 'beta' | 'experimental';
};

export const LILY_COMPONENTS: LilyComponent[] = [
  { name: "button", pascal: "Button", description: "a generic clickable button element", status: "stable" },
  { name: "check-list", pascal: "CheckList", description: "a list of checked items", status: "stable" },
  { name: "mark", pascal: "Mark", description: "a highlighted run of text", status: "stable" },
];
