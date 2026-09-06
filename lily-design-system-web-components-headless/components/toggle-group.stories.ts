import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./toggle-group.js";
import { h } from "../stories/render.js";

const SLOT =
    '<button type="button" aria-pressed="true">Bold</button>' +
    '<button type="button" aria-pressed="false">Italic</button>' +
    '<button type="button" aria-pressed="false">Underline</button>';

const meta: Meta = {
    title: "Forms/ToggleGroup",
    render: (args) => h("lily-toggle-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Text formatting",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
