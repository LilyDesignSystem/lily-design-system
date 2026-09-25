import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./hanguk-jumin-deungnok-beonho-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/HangukJuminDeungnokBeonhoInput",
    render: (args) => h("lily-hanguk-jumin-deungnok-beonho-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Resident Registration Number (주민등록번호)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
