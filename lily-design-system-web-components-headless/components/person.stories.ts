import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./person.js";
import { h } from "../stories/render.js";

const SLOT = "<h2>Ada Lovelace</h2><p>Mathematician and writer.</p>";

const meta: Meta = {
    title: "Navigation/Person",
    render: (args) => h("lily-person", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Ada Lovelace"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
