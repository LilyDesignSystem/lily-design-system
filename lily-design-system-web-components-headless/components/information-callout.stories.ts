import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./information-callout.js";
import { h } from "../stories/render.js";

const SLOT = "Save your work often.";

const meta: Meta = {
    title: "Content/InformationCallout",
    render: (args) => h("lily-information-callout", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Tip"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
