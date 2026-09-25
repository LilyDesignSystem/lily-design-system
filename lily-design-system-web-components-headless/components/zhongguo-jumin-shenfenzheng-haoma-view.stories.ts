import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./zhongguo-jumin-shenfenzheng-haoma-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ZhongguoJuminShenfenzhengHaomaView",
    render: (args) => h("lily-zhongguo-jumin-shenfenzheng-haoma-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Resident Identity Card Number (居民身份证号码)",
        "value": "11010119800101123X"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
