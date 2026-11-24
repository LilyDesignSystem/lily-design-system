// Lily component catalog — generated from components.tsv
// Components across HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks headless

export type LilyComponent = {
  name: string;
  pascal: string;
  description: string;
  /** What it is for: collect, show, navigate, inform, act or structure (tasks.md P46-T3). */
  purpose: 'collect' | 'show' | 'navigate' | 'inform' | 'act' | 'structure';
  /** Maturity: see the rubric in spec/components. */
  status: 'stable' | 'beta' | 'experimental' | 'deprecated' | 'discouraged';
};

export const LILY_COMPONENTS: LilyComponent[] = [
  { name: "button", pascal: "Button", description: "a generic clickable button element", purpose: "act", status: "stable" },
  { name: "check-list", pascal: "CheckList", description: "a list of checked items", purpose: "show", status: "stable" },
  { name: "mark", pascal: "Mark", description: "a highlighted run of text", purpose: "show", status: "stable" },
];

/** Purpose id → display label (tasks.md P46-T3). */
export const PURPOSE_LABEL: Record<string, string> = {
  "collect": "Collect input",
  "show": "Show information",
  "navigate": "Navigate",
  "inform": "Inform or warn",
  "act": "Act or decide",
  "structure": "Structure or style content",
};
