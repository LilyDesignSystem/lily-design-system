import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./lietuva-asmens-kodas-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LietuvaAsmensKodasView",
    render: (args) => h("lily-lietuva-asmens-kodas-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Asmens kodas",
        "value": "38801234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
