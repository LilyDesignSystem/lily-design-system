import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovenija-emso-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenijaEmsoInput",
    render: (args) => h("lily-slovenija-emso-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Enotna Matična Številka Občana (EMŠO)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
