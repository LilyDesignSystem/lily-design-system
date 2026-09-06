import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./headline.js";
import { h } from "../stories/render.js";

const SLOT = 'Breaking: Major Policy Announcement<span slot="subtitle">Government reveals new plan</span><span slot="byline">By Jane Smith</span>';

const meta: Meta = {
    title: "Content/Headline",
    render: (args) => h("lily-headline", args as Record<string, string | boolean>, SLOT),
    args: {
        "level": "1",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
