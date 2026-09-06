import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./listbox.js";
import { h } from "../stories/render.js";

const SLOT = `
  <div role="option" tabindex="-1" aria-selected="true">High</div>
  <div role="option" tabindex="-1" aria-selected="false">Medium</div>
  <div role="option" tabindex="-1" aria-selected="false">Low</div>
`;

const meta: Meta = {
    title: "Content/Listbox",
    render: (args) => h("lily-listbox", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Select priority",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
