import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./theme-select-option.js";
import { h } from "../stories/render.js";

// theme-select-option upgrades into a real <option>, which is only valid
// (and only rendered by the browser) inside a <select> — so the story's
// static markup wraps it in one, matching the plain-HTML sibling's own
// demo shape (lily-design-system-html-headless/components/
// theme-select-option.html).
const SLOT = "Dark";

const meta: Meta = {
    title: "Forms/ThemeSelectOption",
    render: (args) => {
        const select = document.createElement("select");
        select.appendChild(h("lily-theme-select-option", args as Record<string, string | boolean>, SLOT));
        return select;
    },
    args: {
        "value": "dark",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
