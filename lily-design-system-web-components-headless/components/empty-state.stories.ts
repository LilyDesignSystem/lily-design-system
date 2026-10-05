import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./empty-state.js";
import { h } from "../stories/render.js";

const SLOT = '<h2>No projects yet</h2><p>Create one to get started.</p>';

const meta: Meta = {
    title: "Content/EmptyState",
    render: (args) => h("lily-empty-state", args as Record<string, string | boolean>, SLOT),
    args: { "label": "No projects" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
