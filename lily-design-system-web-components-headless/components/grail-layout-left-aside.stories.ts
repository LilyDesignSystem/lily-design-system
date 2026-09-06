import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout-left-aside.js";
import { h } from "../stories/render.js";

const SLOT = "<nav>Filters</nav>";

const meta: Meta = {
    title: "Navigation/GrailLayoutLeftAside",
    render: (args) => h("lily-grail-layout-left-aside", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
