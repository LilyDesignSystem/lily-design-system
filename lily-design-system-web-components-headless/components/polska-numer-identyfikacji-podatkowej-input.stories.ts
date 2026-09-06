import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./polska-numer-identyfikacji-podatkowej-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PolskaNumerIdentyfikacjiPodatkowejInput",
    render: (args) => h("lily-polska-numer-identyfikacji-podatkowej-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Numer Identyfikacji Podatkowej (NIP)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
