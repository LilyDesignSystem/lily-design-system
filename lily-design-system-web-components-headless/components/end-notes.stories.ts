import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./end-notes.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Sources</h2><p>Data compiled from public records.</p>";

const meta: Meta = {
    title: "Navigation/EndNotes",
    render: (args) => h("lily-end-notes", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "End notes"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
