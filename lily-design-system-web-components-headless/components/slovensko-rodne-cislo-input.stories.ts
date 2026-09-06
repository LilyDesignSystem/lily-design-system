import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./slovensko-rodne-cislo-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/SlovenskoRodneCisloInput",
    render: (args) => h("lily-slovensko-rodne-cislo-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rodné číslo (RČ)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
