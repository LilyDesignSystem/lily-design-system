import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout-bottom-footer.js";
import { h } from "../stories/render.js";

const SLOT = "<p>&copy; 2026 Lily Design System</p>";

const meta: Meta = {
    title: "Navigation/GrailLayoutBottomFooter",
    render: (args) => h("lily-grail-layout-bottom-footer", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
