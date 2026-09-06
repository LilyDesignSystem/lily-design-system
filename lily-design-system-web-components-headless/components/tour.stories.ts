import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tour.js";
import "./tour-list.js";
import "./tour-list-item.js";
import { h } from "../stories/render.js";

const SLOT =
    '<lily-tour-list label="Getting started" active>' +
    '<lily-tour-list-item label="Welcome" current step-number="1" total-steps="1">Welcome to the app!</lily-tour-list-item>' +
    "</lily-tour-list>";

const meta: Meta = {
    title: "Content/Tour",
    render: (args) => h("lily-tour", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Patient record system walkthrough",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
