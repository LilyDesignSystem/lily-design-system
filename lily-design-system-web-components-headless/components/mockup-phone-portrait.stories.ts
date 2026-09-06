import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mockup-phone-portrait.js";
import { h } from "../stories/render.js";

const SLOT = "<p>Home screen preview</p>";

const meta: Meta = {
    title: "Content/MockupPhonePortrait",
    render: (args) => h("lily-mockup-phone-portrait", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Preview of the home screen",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
