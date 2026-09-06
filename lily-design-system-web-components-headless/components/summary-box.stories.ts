import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./summary-box.js";
import { h } from "../stories/render.js";

const SLOT = "<ul><li>Eligibility extends to all citizens 18 and older.</li><li>Applications are reviewed within 10 business days.</li></ul>";

const meta: Meta = {
    title: "Navigation/SummaryBox",
    render: (args) => h("lily-summary-box", args as Record<string, string | boolean>, SLOT),
    args: {
        "heading": "Key takeaways"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
