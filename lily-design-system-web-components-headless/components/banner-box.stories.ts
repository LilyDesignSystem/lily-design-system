import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./banner-box.js";
import { h } from "../stories/render.js";

const SLOT = "<span>A new version is available.</span> <button type=\"button\">Refresh</button>";

const meta: Meta = {
    title: "Content/BannerBox",
    render: (args) => h("lily-banner-box", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
