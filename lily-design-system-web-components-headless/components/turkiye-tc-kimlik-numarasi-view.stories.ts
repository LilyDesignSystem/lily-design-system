import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./turkiye-tc-kimlik-numarasi-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/TurkiyeTcKimlikNumarasiView",
    render: (args) => h("lily-turkiye-tc-kimlik-numarasi-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "T.C. Kimlik Numarası",
        "value": "12345678902"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
