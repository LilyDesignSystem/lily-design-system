import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./lietuva-asmens-kodas-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/LietuvaAsmensKodasInput",
    render: (args) => h("lily-lietuva-asmens-kodas-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Asmens kodas"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
