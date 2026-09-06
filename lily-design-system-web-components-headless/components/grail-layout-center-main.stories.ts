import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout-center-main.js";
import { h } from "../stories/render.js";

const SLOT = "<h1>Primary content</h1><p>The main content region of the page.</p>";

const meta: Meta = {
    title: "Navigation/GrailLayoutCenterMain",
    render: (args) => h("lily-grail-layout-center-main", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
