import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./cesko-rodne-cislo-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/CeskoRodneCisloInput",
    render: (args) => h("lily-cesko-rodne-cislo-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rodné Číslo"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
