import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cesko-cestovni-pas-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CeskoCestovniPasView",
    render: (args) => h("lily-cesko-cestovni-pas-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Cestovní Pas",
        "value": "12345678"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
