import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ellada-dematerialised-securities-system-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ElladaDematerialisedSecuritiesSystemInput",
    render: (args) => h("lily-ellada-dematerialised-securities-system-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Dematerialised Securities System"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
