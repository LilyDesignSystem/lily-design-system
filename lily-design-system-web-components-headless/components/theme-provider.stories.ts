import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./theme-provider.js";
import { h } from "../stories/render.js";
import type { ThemeProvider } from "./theme-provider.js";

const SLOT = "<p>Themed content goes here.</p>";

const meta: Meta = {
    title: "Content/ThemeProvider",
    render: (args) => {
        const el = h("lily-theme-provider", args as Record<string, string | boolean>, SLOT) as ThemeProvider;
        el.theme = { color: { primary: "#2563eb", danger: "#dc2626" }, space: { md: "1rem" } };
        return el;
    },
    args: {
        "base": "light",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
