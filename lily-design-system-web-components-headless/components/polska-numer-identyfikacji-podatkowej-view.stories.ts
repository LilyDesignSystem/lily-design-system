import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./polska-numer-identyfikacji-podatkowej-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PolskaNumerIdentyfikacjiPodatkowejView",
    render: (args) => h("lily-polska-numer-identyfikacji-podatkowej-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numer Identyfikacji Podatkowej (NIP)",
        "value": "1234563218"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
