import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./prathet-thai-lek-prajam-tua-prachachon-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PrathetThaiLekPrajamTuaPrachachonView",
    render: (args) => h("lily-prathet-thai-lek-prajam-tua-prachachon-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "เลขประจำตัวประชาชน (National ID)",
        "value": "1234567890123"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
