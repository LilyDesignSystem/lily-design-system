import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./taiwan-guomin-shenfenzheng-tongyi-bianhao-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/TaiwanGuominShenfenzhengTongyiBianhaoView",
    render: (args) =>
        h(
            "lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Card Number",
        value: "A123456789",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
