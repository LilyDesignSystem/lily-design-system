import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tuaisceart-eireann-health-and-care-number-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/TuaisceartEireannHealthAndCareNumberInput",
    render: (args) => h("lily-tuaisceart-eireann-health-and-care-number-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Health and Care (H&C) Number"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
