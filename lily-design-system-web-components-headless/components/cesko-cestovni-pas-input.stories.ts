import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cesko-cestovni-pas-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CeskoCestovniPasInput",
    render: (args) => h("lily-cesko-cestovni-pas-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cestovní Pas"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
