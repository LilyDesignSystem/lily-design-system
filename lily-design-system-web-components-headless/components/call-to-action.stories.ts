import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./call-to-action.js";
import { h } from "../stories/render.js";

const SLOT = "Sign Up Now";

const meta: Meta = {
    title: "Content/CallToAction",
    render: (args) => h("lily-call-to-action", args as Record<string, string | boolean>, SLOT),
    args: {
        "href": "/signup",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
