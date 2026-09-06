import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./grail-layout.js";
import { h } from "../stories/render.js";

const SLOT = "<header>Clinical Portal</header><aside>Sections</aside><main>Patient Dashboard</main><aside>Quick links</aside><footer>Footer</footer>";

const meta: Meta = {
    title: "Content/GrailLayout",
    render: (args) => h("lily-grail-layout", args as Record<string, string | boolean>, SLOT),
    args: {},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
