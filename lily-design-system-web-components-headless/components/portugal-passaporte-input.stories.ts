import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./portugal-passaporte-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PortugalPassaporteInput",
    render: (args) => h("lily-portugal-passaporte-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Passaporte"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
