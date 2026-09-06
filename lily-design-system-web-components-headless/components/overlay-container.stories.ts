import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./overlay-container.js";
import { h } from "../stories/render.js";

const SLOT = '<div role="dialog" aria-modal="true">Modal content</div>';

const meta: Meta = {
    title: "Content/OverlayContainer",
    render: (args) => h("lily-overlay-container", args as Record<string, string | boolean>, SLOT),
    args: {
        open: true,
        label: "Modal backdrop",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
