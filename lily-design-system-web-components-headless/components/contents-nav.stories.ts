import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./contents-nav.js";
import { h } from "../stories/render.js";

const SLOT =
    "<ol><li><a href=\"#introduction\">Introduction</a></li><li><a href=\"#usage\">Usage</a></li><li><a href=\"#examples\">Examples</a></li></ol>";

const meta: Meta = {
    title: "Navigation/ContentsNav",
    render: (args) => h("lily-contents-nav", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "On this page"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
