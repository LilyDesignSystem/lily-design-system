import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./romania-pasaport-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/RomaniaPasaportView",
    render: (args) => h("lily-romania-pasaport-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Pașaport",
        "value": "AB123456"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
