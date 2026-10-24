export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  tag: string;
  category: string;
}

export const components: ComponentMeta[] = [
  {
      slug: "button",
      name: "Button",
      description: "a generic clickable button element",
      tag: "button",
      category: "buttons",
  },
  {
      slug: "check-list",
      name: "CheckList",
      description: "a list of checked items",
      tag: "ol",
      category: "lists",
  },
  {
      slug: "mark",
      name: "Mark",
      description: "a highlighted run of text",
      tag: "mark",
      category: "text",
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
