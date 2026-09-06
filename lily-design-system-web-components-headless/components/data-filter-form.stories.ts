import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./data-filter-form.js";
import { h } from "../stories/render.js";

const SLOT = '<button type="submit">Apply</button><button type="reset">Clear</button>';

const meta: Meta = {
    title: "Forms/DataFilterForm",
    render: (args) => h("lily-data-filter-form", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Filter results"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
