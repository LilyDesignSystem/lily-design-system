import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./romania-cod-numeric-personal-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/RomaniaCodNumericPersonalView",
    render: (args) => h("lily-romania-cod-numeric-personal-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cod Numeric Personal (CNP)",
        "value": "1900101221144"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
