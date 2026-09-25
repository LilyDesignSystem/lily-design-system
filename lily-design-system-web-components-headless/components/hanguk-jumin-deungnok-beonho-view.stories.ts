import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hanguk-jumin-deungnok-beonho-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/HangukJuminDeungnokBeonhoView",
    render: (args) => h("lily-hanguk-jumin-deungnok-beonho-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Resident Registration Number (주민등록번호)",
        "value": "900101-1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
