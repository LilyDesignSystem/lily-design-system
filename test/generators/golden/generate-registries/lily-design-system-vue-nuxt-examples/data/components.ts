export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  tag: string;
  category: string;
  purpose: string;
}

export const components: ComponentMeta[] = [
  {
      slug: "button",
      name: "Button",
      description: "a generic clickable button element",
      tag: "button",
      category: "buttons",
      purpose: "act",
  },
  {
      slug: "check-list",
      name: "CheckList",
      description: "a list of checked items",
      tag: "ol",
      category: "lists",
      purpose: "show",
  },
  {
      slug: "mark",
      name: "Mark",
      description: "a highlighted run of text",
      tag: "mark",
      category: "text",
      purpose: "show",
  },
];

/** Category id → display label (plan P6-T5's category filter). */
export const CATEGORY_LABEL: Record<string, string> = {
  "national": "Special-Purpose Identifiers",
  "forms": "Form controls",
  "buttons": "Buttons",
  "links": "Links",
  "lists": "Lists",
  "tables": "Tables",
  "navigation": "Navigation & structure",
  "overlays": "Overlays & dialogs",
  "pickers": "Pickers & ratings",
  "media": "Media & figures",
  "data-viz": "Data visualization",
  "content": "Content & other",
};

/** Purpose id → display label (tasks.md P46-T3). */
export const PURPOSE_LABEL: Record<string, string> = {
  "collect": "Collect input",
  "show": "Show information",
  "navigate": "Navigate",
  "inform": "Inform or warn",
  "act": "Act or decide",
  "structure": "Structure or style content",
};
