import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cesko-rodne-cislo-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CeskoRodneCisloView",
    render: (args) => h("lily-cesko-rodne-cislo-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rodné Číslo",
        "value": "855323/1237"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
