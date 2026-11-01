import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./iran-kod-e-melli-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IranKodEMelliView",
    render: (args) =>
        h("lily-iran-kod-e-melli-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "National Code (Kod-e Melli)",
        value: "0084575948",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
