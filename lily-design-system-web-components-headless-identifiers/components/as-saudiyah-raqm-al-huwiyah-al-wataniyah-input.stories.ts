import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./as-saudiyah-raqm-al-huwiyah-al-wataniyah-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AsSaudiyahRaqmAlHuwiyahAlWataniyahInput",
    render: (args) =>
        h(
            "lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
