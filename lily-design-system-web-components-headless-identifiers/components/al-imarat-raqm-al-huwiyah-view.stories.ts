import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./al-imarat-raqm-al-huwiyah-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AlImaratRaqmAlHuwiyahView",
    render: (args) =>
        h("lily-al-imarat-raqm-al-huwiyah-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Emirates ID number",
        value: "784-1985-1234567-1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
