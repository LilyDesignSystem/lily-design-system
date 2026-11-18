import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./al-imarat-raqm-al-huwiyah-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AlImaratRaqmAlHuwiyahInput",
    render: (args) =>
        h("lily-al-imarat-raqm-al-huwiyah-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Emirates ID number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
