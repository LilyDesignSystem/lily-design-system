import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./taiwan-guomin-shenfenzheng-tongyi-bianhao-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/TaiwanGuominShenfenzhengTongyiBianhaoInput",
    render: (args) =>
        h(
            "lily-taiwan-guomin-shenfenzheng-tongyi-bianhao-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "National Identification Card Number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
