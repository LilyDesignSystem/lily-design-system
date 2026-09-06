import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hint.js";
import { h } from "../stories/render.js";

const SLOT = "This is a 10-digit number, like 485 777 3456. You can find it on any letter the NHS has sent you.";

const meta: Meta = {
    title: "Content/Hint",
    render: (args) => h("lily-hint", args as Record<string, string | boolean>, SLOT),
    args: {
        "id": "nhs-number-hint",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
