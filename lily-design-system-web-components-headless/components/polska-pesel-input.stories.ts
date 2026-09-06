import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./polska-pesel-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PolskaPeselInput",
    render: (args) => h("lily-polska-pesel-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "PESEL"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
