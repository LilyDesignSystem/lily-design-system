import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./select-with-extras.js";
import { h } from "../stories/render.js";

const SLOT = '<option value="us">USA</option><option value="uk">United Kingdom</option><option value="fr">France</option>';

const meta: Meta = {
    title: "Content/SelectWithExtras",
    render: (args) => h("lily-select-with-extras", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Country",
        "value": "uk"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
