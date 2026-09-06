import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovenija-emso-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenijaEmsoView",
    render: (args) => h("lily-slovenija-emso-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Enotna Matična Številka Občana (EMŠO)",
        "value": "0101006500006"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
