import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nihon-kojin-bango-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/NihonKojinBangoInput",
    render: (args) => h("lily-nihon-kojin-bango-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Number / My Number (マイナンバー)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
