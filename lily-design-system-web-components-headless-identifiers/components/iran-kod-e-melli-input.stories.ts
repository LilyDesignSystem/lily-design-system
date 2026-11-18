import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./iran-kod-e-melli-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IranKodEMelliInput",
    render: (args) =>
        h("lily-iran-kod-e-melli-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "National Code (Kod-e Melli)",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
