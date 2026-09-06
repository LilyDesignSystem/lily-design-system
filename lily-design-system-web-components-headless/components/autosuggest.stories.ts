import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./autosuggest.js";
import { h } from "../stories/render.js";

const SLOT =
    '<li role="option" data-value="uk">United Kingdom</li>' +
    '<li role="option" data-value="us">United States</li>' +
    '<li role="option" data-value="ca">Canada</li>';

const meta: Meta = {
    title: "Content/Autosuggest",
    render: (args) => h("lily-autosuggest", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Country",
        "placeholder": "Start typing…",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
