import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./osterreich-sozialversicherungsnummer-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/OsterreichSozialversicherungsnummerInput",
    render: (args) => h("lily-osterreich-sozialversicherungsnummer-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sozialversicherungsnummer (SVNR)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
