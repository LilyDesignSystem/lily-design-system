import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./turkiye-tc-kimlik-numarasi-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/TurkiyeTcKimlikNumarasiInput",
    render: (args) => h("lily-turkiye-tc-kimlik-numarasi-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "T.C. Kimlik Numarası"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
