import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovensko-rodne-cislo-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenskoRodneCisloView",
    render: (args) => h("lily-slovensko-rodne-cislo-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rodné číslo (RČ)",
        "value": "9606234816"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
