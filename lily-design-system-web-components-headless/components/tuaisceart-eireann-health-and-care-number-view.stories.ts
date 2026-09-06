import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tuaisceart-eireann-health-and-care-number-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/TuaisceartEireannHealthAndCareNumberView",
    render: (args) => h("lily-tuaisceart-eireann-health-and-care-number-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Health and Care (H&C) Number",
        "value": "123 456 7890"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
