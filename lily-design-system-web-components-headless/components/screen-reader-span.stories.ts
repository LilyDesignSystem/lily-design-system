import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./screen-reader-span.js";
import { h } from "../stories/render.js";

const SLOT = "Opens in a new tab";

const meta: Meta = {
    title: "Content/ScreenReaderSpan",
    render: (args) => h("lily-screen-reader-span", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
