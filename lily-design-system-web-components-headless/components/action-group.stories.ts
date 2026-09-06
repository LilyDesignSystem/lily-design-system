import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./action-group.js";
import { h } from "../stories/render.js";

const SLOT =
    '<button type="button">Save</button><button type="button">Discard</button>' +
    '<div slot="overflow"><button type="button" role="menuitem">Archive</button><button type="button" role="menuitem">Duplicate</button></div>';

const meta: Meta = {
    title: "Forms/ActionGroup",
    render: (args) => h("lily-action-group", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Document actions",
        "overflow-label": "More actions"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
