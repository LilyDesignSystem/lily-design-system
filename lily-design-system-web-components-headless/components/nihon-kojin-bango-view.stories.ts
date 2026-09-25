import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./nihon-kojin-bango-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/NihonKojinBangoView",
    render: (args) => h("lily-nihon-kojin-bango-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Individual Number / My Number (マイナンバー)",
        "value": "123456789012"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
