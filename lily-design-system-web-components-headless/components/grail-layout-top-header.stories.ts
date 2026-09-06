import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout-top-header.js";
import { h } from "../stories/render.js";

const SLOT = "<nav>Site navigation</nav>";

const meta: Meta = {
    title: "Navigation/GrailLayoutTopHeader",
    render: (args) => h("lily-grail-layout-top-header", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
