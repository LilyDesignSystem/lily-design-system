import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./as-saudiyah-raqm-al-huwiyah-al-wataniyah-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/AsSaudiyahRaqmAlHuwiyahAlWataniyahView",
    render: (args) =>
        h(
            "lily-as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Number",
        value: "1000000008",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
