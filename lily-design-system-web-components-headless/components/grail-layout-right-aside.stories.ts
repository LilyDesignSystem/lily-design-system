import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout-right-aside.js";
import { h } from "../stories/render.js";

const SLOT = "<nav>Related links</nav>";

const meta: Meta = {
    title: "Navigation/GrailLayoutRightAside",
    render: (args) => h("lily-grail-layout-right-aside", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
