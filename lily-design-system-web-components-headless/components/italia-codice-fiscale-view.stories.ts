import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./italia-codice-fiscale-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ItaliaCodiceFiscaleView",
    render: (args) => h("lily-italia-codice-fiscale-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Codice Fiscale",
        "value": "RSSMRA85M01H501Z"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
