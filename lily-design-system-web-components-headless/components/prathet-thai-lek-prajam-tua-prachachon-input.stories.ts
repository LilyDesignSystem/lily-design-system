import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./prathet-thai-lek-prajam-tua-prachachon-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PrathetThaiLekPrajamTuaPrachachonInput",
    render: (args) => h("lily-prathet-thai-lek-prajam-tua-prachachon-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "เลขประจำตัวประชาชน (National ID)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
