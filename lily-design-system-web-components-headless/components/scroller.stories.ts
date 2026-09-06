import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./scroller.js";
import { h } from "../stories/render.js";

const SLOT = [
    '<div slot="background">Background media.</div>',
    "<div>Step 1</div>",
    "<div>Step 2</div>",
    "<div>Step 3</div>",
].join("");

const meta: Meta = {
    title: "Content/Scroller",
    render: (args) => h("lily-scroller", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Our story",
        "offset": "0.5"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
