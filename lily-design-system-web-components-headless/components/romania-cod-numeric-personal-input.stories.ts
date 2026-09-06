import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./romania-cod-numeric-personal-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/RomaniaCodNumericPersonalInput",
    render: (args) => h("lily-romania-cod-numeric-personal-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cod Numeric Personal (CNP)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
