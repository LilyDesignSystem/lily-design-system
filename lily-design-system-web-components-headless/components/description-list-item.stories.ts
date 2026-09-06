import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./description-list-item.js";
import { h } from "../stories/render.js";

const SLOT = "<dt>Name</dt><dd>Ada Lovelace</dd>";

const meta: Meta = {
    title: "Content/DescriptionListItem",
    render: (args) => h("lily-description-list-item", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Name",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
