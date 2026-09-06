import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./error-summary.js";
import { h } from "../stories/render.js";

const SLOT =
    '<ul><li><a href="#name">Enter your name</a></li><li><a href="#email">Enter a valid email address</a></li></ul>';

const meta: Meta = {
    title: "Content/ErrorSummary",
    render: (args) => h("lily-error-summary", args as Record<string, string | boolean>, SLOT),
    args: {
        "title": "There is a problem",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
