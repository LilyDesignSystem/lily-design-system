import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./osterreich-sozialversicherungsnummer-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/OsterreichSozialversicherungsnummerView",
    render: (args) => h("lily-osterreich-sozialversicherungsnummer-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sozialversicherungsnummer (SVNR)",
        "value": "1234 010180"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
