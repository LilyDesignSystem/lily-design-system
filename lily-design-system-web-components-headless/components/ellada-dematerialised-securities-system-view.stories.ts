import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ellada-dematerialised-securities-system-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ElladaDematerialisedSecuritiesSystemView",
    render: (args) => h("lily-ellada-dematerialised-securities-system-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Dematerialised Securities System",
        "value": "1234567890"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
