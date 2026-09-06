import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./italia-codice-fiscale-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ItaliaCodiceFiscaleInput",
    render: (args) => h("lily-italia-codice-fiscale-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Codice Fiscale"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
