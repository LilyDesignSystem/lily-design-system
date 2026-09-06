import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./transfer-list.js";
import { h } from "../stories/render.js";

const SLOT =
    '<ul role="listbox" slot="source"><li role="option">Admin</li><li role="option">Editor</li></ul>' +
    '<div slot="actions"><button type="button" aria-label="Move to selected">→</button><button type="button" aria-label="Move to available">←</button></div>' +
    '<ul role="listbox" slot="target"><li role="option">Viewer</li></ul>';

const meta: Meta = {
    title: "Content/TransferList",
    render: (args) => h("lily-transfer-list", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Assign roles",
        "source-label": "Available roles",
        "target-label": "Selected roles",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
